import { get } from 'svelte/store';
import { gameState, CROP_DEFINITIONS, TOOL_DEFINITIONS, TREE_DEFINITIONS, updateLastTime } from '../stores/farm';
import type { Tree } from '../stores/farm';

/**
 * Update crop growth based on elapsed time
 */
export function updateCropGrowth(): void {
    const state = get(gameState);
    const now = Date.now();
    const deltaTime = (now - state.lastUpdateTime) / 1000; // Convert to seconds

    let hasChanges = false;

    const updatedTiles = state.tiles.map((tile) => {
        if (tile.crop && tile.crop.growthProgress < 1) {
            const cropDef = CROP_DEFINITIONS.find((c) => c.id === tile.crop!.type);
            if (!cropDef) return tile;

            // Calculate growth rate
            let growthRate = 1 / cropDef.growthTime; // Progress per second

            // Apply watering can bonus if owned
            if (state.ownedTools.includes('watering_can')) {
                growthRate *= 1.2; // 20% faster growth
            }

            // Apply well bonus if owned
            const hasWell = state.placeables.some(
                (p) => p.type === 'building' && p.data && (p.data as any).type === 'well'
            );
            if (hasWell) {
                growthRate *= 1.1; // 10% faster growth
            }

            const newProgress = Math.min(
                tile.crop.growthProgress + growthRate * deltaTime,
                1
            );

            if (newProgress !== tile.crop.growthProgress) {
                hasChanges = true;
                return {
                    ...tile,
                    crop: {
                        ...tile.crop,
                        growthProgress: newProgress,
                    },
                };
            }
        }
        return tile;
    });

    // Update tree growth
    const updatedPlaceables = state.placeables.map((placeable) => {
        if (placeable.type === 'tree' && placeable.data) {
            const tree = placeable.data as Tree;
            if (tree.growthProgress < 1) {
                const treeDef = TREE_DEFINITIONS.find((t) => t.id === tree.type);
                if (!treeDef) return placeable;

                const growthRate = 1 / treeDef.growthTime;
                const newProgress = Math.min(
                    tree.growthProgress + growthRate * deltaTime,
                    1
                );

                if (newProgress !== tree.growthProgress) {
                    hasChanges = true;
                    return {
                        ...placeable,
                        data: {
                            ...tree,
                            growthProgress: newProgress,
                        },
                    };
                }
            }
        }
        return placeable;
    });

    if (hasChanges) {
        gameState.update((s) => ({
            ...s,
            tiles: updatedTiles,
            placeables: updatedPlaceables,
            lastUpdateTime: now,
        }));
    } else {
        updateLastTime();
    }
}

/**
 * Start the farming game loop
 */
export function startFarmingLoop(): () => void {
    let animationFrameId: number;
    let lastFrameTime = Date.now();

    function loop() {
        const now = Date.now();
        const elapsed = now - lastFrameTime;

        // Update every 100ms to reduce CPU usage
        if (elapsed >= 100) {
            updateCropGrowth();
            lastFrameTime = now;
        }

        animationFrameId = requestAnimationFrame(loop);
    }

    animationFrameId = requestAnimationFrame(loop);

    // Return cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}

/**
 * Get crop definition by ID
 */
export function getCropDefinition(cropId: string) {
    return CROP_DEFINITIONS.find((c) => c.id === cropId);
}

/**
 * Get tool definition by ID
 */
export function getToolDefinition(toolId: string) {
    return TOOL_DEFINITIONS.find((t) => t.id === toolId);
}

/**
 * Check if a crop is ready to harvest
 */
export function isCropReadyToHarvest(cropProgress: number): boolean {
    return cropProgress >= 1;
}

/**
 * Check if player can afford an item
 */
export function canAfford(cost: number): boolean {
    const state = get(gameState);
    return state.coins >= cost;
}

/**
 * Check if an item is unlocked
 */
export function isUnlocked(unlockLevel: number): boolean {
    const state = get(gameState);
    return state.level >= unlockLevel;
}
