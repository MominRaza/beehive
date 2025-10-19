import { get } from 'svelte/store';
import { gameState } from './farmState';
import { TREE_DEFINITIONS, BUILDING_DEFINITIONS } from './farmDefinitions';
import { spendCoins, addXP, selectChunkForPurchase } from './farmActionsBasic';
import { isChunkOrthogonallyAdjacent } from './farmHelpers';
import type { Tree } from './farmTypes';

// ========== Placeable Actions ==========

export function placeTree(x: number, z: number, treeType: string): boolean {
    const state = get(gameState);
    const treeDef = TREE_DEFINITIONS.find((t) => t.id === treeType);

    if (!treeDef) return false;
    if (!spendCoins(treeDef.cost)) return false;

    // Check if position is valid (not on a tile, not occupied)
    const tile = state.tiles.find((t) => t.x === x && t.z === z);
    if (tile) return false; // Can't place on farmable tile

    const occupied = state.placeables.find((p) => p.x === x && p.z === z);
    if (occupied) return false;

    gameState.update((s) => ({
        ...s,
        placeables: [
            ...s.placeables,
            {
                x,
                z,
                type: 'tree',
                data: {
                    type: treeType,
                    plantedAt: Date.now(),
                    growthProgress: 0,
                },
            },
        ],
    }));
    return true;
}

export function placeBuilding(x: number, z: number, buildingType: string): boolean {
    const state = get(gameState);
    const buildingDef = BUILDING_DEFINITIONS.find((b) => b.id === buildingType);

    if (!buildingDef) return false;
    if (!spendCoins(buildingDef.coinCost)) return false;
    if (state.inventory.wood < buildingDef.woodCost) return false;

    // Check if position is valid
    const tile = state.tiles.find((t) => t.x === x && t.z === z);
    if (tile) return false;

    const occupied = state.placeables.find((p) => p.x === x && p.z === z);
    if (occupied) return false;

    gameState.update((s) => {
        const newInventory = { ...s.inventory };
        newInventory.wood -= buildingDef.woodCost;

        return {
            ...s,
            inventory: newInventory,
            placeables: [
                ...s.placeables,
                {
                    x,
                    z,
                    type: 'building',
                    data: {
                        type: buildingType,
                        builtAt: Date.now(),
                    },
                },
            ],
        };
    });
    return true;
}

export function harvestTree(placeableIndex: number): boolean {
    const state = get(gameState);
    if (placeableIndex < 0 || placeableIndex >= state.placeables.length) return false;

    const placeable = state.placeables[placeableIndex];
    if (placeable.type !== 'tree' || !placeable.data) return false;

    const tree = placeable.data as Tree;
    const treeDef = TREE_DEFINITIONS.find((t) => t.id === tree.type);
    if (!treeDef) return false;

    // Check if tree is mature
    if (tree.growthProgress < 1) return false;

    // For fruit trees, check if harvestable
    if (treeDef.fruitYield && treeDef.fruitType) {
        const timeSinceLastHarvest = tree.lastHarvest
            ? (Date.now() - tree.lastHarvest) / 1000
            : treeDef.harvestInterval + 1;

        if (timeSinceLastHarvest >= treeDef.harvestInterval) {
            // Harvest fruit
            gameState.update((s) => {
                const newInventory = { ...s.inventory };
                newInventory.food = { ...newInventory.food };
                newInventory.food[treeDef.fruitType!] =
                    (newInventory.food[treeDef.fruitType!] || 0) + treeDef.fruitYield!;

                const newPlaceables = [...s.placeables];
                newPlaceables[placeableIndex] = {
                    ...placeable,
                    data: {
                        ...tree,
                        lastHarvest: Date.now(),
                    },
                };

                return { ...s, inventory: newInventory, placeables: newPlaceables };
            });
            addXP(10);
            return true;
        }
    }

    return false;
}

export function chopTree(placeableIndex: number): boolean {
    const state = get(gameState);
    if (!state.ownedTools.includes('axe')) return false;
    if (placeableIndex < 0 || placeableIndex >= state.placeables.length) return false;

    const placeable = state.placeables[placeableIndex];
    if (placeable.type !== 'tree' || !placeable.data) return false;

    const tree = placeable.data as Tree;
    const treeDef = TREE_DEFINITIONS.find((t) => t.id === tree.type);
    if (!treeDef) return false;

    // Check if tree is mature
    if (tree.growthProgress < 1) return false;

    // Remove tree and add wood
    gameState.update((s) => {
        const newInventory = { ...s.inventory };
        newInventory.wood += treeDef.woodYield;

        const newPlaceables = s.placeables.filter((_, i) => i !== placeableIndex);

        return { ...s, inventory: newInventory, placeables: newPlaceables };
    });
    addXP(15);
    return true;
}

export function buyChunk(chunkId: string): boolean {
    const state = get(gameState);
    const chunk = state.chunks.find((c) => c.id === chunkId);

    if (!chunk || chunk.isOwned) return false;
    if (!isChunkOrthogonallyAdjacent(state.chunks, chunk)) return false;
    if (!spendCoins(chunk.cost)) return false;

    gameState.update((s) => {
        const newChunks = s.chunks.map((c) =>
            c.id === chunkId ? { ...c, isOwned: true } : c
        );

        // Unlock all tiles in this chunk
        const newTiles = s.tiles.map((t) =>
            t.chunkId === chunkId ? { ...t, isLocked: false } : t
        );

        return { ...s, chunks: newChunks, tiles: newTiles };
    });
    selectChunkForPurchase(null);
    return true;
}
