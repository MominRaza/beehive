import { get } from 'svelte/store';
import { gameState } from './farmState';
import { CROP_DEFINITIONS } from './farmDefinitions';
import { addXP } from './farmActionsBasic';

// ========== Farming Actions ==========

export function plowTile(tileIndex: number): boolean {
    const state = get(gameState);
    if (tileIndex < 0 || tileIndex >= state.tiles.length) return false;

    const tile = state.tiles[tileIndex];
    if (tile.isPlowed) return false;

    gameState.update((s) => {
        const newTiles = [...s.tiles];
        newTiles[tileIndex] = { ...tile, isPlowed: true };
        return { ...s, tiles: newTiles };
    });
    return true;
}

export function plantCrop(tileIndex: number, cropType: string): boolean {
    const state = get(gameState);
    const cropDef = CROP_DEFINITIONS.find((c) => c.id === cropType);

    if (!cropDef) return false;
    if (tileIndex < 0 || tileIndex >= state.tiles.length) return false;

    const tile = state.tiles[tileIndex];
    if (!tile.isPlowed || tile.crop || tile.isLocked) return false;

    // Check inventory
    const seedCount = state.inventory.seeds[cropType] || 0;
    if (seedCount <= 0) return false;

    gameState.update((s) => {
        const newTiles = [...s.tiles];
        newTiles[tileIndex] = {
            ...tile,
            crop: {
                type: cropType,
                plantedAt: Date.now(),
                growthProgress: 0,
            },
        };

        // Decrease seed count
        const newInventory = { ...s.inventory };
        newInventory.seeds = { ...newInventory.seeds };
        newInventory.seeds[cropType] = seedCount - 1;

        return { ...s, tiles: newTiles, inventory: newInventory };
    });
    return true;
}

export function harvestCrop(tileIndex: number): boolean {
    const state = get(gameState);
    if (tileIndex < 0 || tileIndex >= state.tiles.length) return false;

    const tile = state.tiles[tileIndex];
    if (!tile.crop || tile.crop.growthProgress < 1) return false;

    const cropDef = CROP_DEFINITIONS.find((c) => c.id === tile.crop!.type);
    if (!cropDef) return false;

    // Add harvested crop to inventory
    const harvestAmount = 1; // Each harvest gives 1 food item
    addXP(cropDef.harvestXP);

    gameState.update((s) => {
        const newTiles = [...s.tiles];
        newTiles[tileIndex] = { ...tile, crop: null };
        const newFood = { ...s.inventory.food };
        newFood[tile.crop!.type] = (newFood[tile.crop!.type] || 0) + harvestAmount;
        return {
            ...s,
            tiles: newTiles,
            inventory: {
                ...s.inventory,
                food: newFood,
            },
        };
    });
    return true;
}
