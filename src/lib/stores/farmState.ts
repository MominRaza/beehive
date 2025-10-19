import { writable, derived } from 'svelte/store';
import { loadGameState } from '../systems/storage';
import type { GameState } from './farmTypes';
import { CROP_DEFINITIONS, TOOL_DEFINITIONS, TREE_DEFINITIONS, BUILDING_DEFINITIONS } from './farmDefinitions';
import { createInitialState, calculateLevelFromXP, calculateXPForNextLevel, isChunkOrthogonallyAdjacent } from './farmHelpers';

// ========== Store ==========

const savedState = loadGameState();
export const gameState = writable<GameState>(savedState || createInitialState());

// ========== Derived Stores ==========

export const currentLevel = derived(gameState, ($state) => $state.level);

export const xpProgress = derived(gameState, ($state) => {
    const xpForCurrent = calculateXPForNextLevel($state.level - 1);
    const xpForNext = calculateXPForNextLevel($state.level);
    const progress = ($state.xp - xpForCurrent) / (xpForNext - xpForCurrent);
    return {
        current: $state.xp - xpForCurrent,
        needed: xpForNext - xpForCurrent,
        progress: Math.min(Math.max(progress, 0), 1),
    };
});

export const availableSeeds = derived(gameState, ($state) => {
    return CROP_DEFINITIONS.filter((crop) => crop.unlockLevel <= $state.level);
});

export const lockedSeeds = derived(gameState, ($state) => {
    return CROP_DEFINITIONS.filter((crop) => crop.unlockLevel > $state.level);
});

export const availableTools = derived(gameState, ($state) => {
    return TOOL_DEFINITIONS.filter((tool) => tool.unlockLevel <= $state.level);
});

export const lockedTools = derived(gameState, ($state) => {
    return TOOL_DEFINITIONS.filter((tool) => tool.unlockLevel > $state.level);
});

export const availableTrees = derived(gameState, ($state) => {
    return TREE_DEFINITIONS.filter((tree) => tree.unlockLevel <= $state.level);
});

export const lockedTrees = derived(gameState, ($state) => {
    return TREE_DEFINITIONS.filter((tree) => tree.unlockLevel > $state.level);
});

export const availableBuildings = derived(gameState, ($state) => {
    return BUILDING_DEFINITIONS.filter((building) => building.unlockLevel <= $state.level);
});

export const lockedBuildings = derived(gameState, ($state) => {
    return BUILDING_DEFINITIONS.filter((building) => building.unlockLevel > $state.level);
});

export const ownedChunks = derived(gameState, ($state) => {
    return $state.chunks.filter((chunk) => chunk.isOwned);
});

export const availableChunks = derived(gameState, ($state) => {
    return $state.chunks.filter(
        (chunk) => !chunk.isOwned && isChunkOrthogonallyAdjacent($state.chunks, chunk)
    );
});

// Re-export for convenience
export { CROP_DEFINITIONS, TOOL_DEFINITIONS, TREE_DEFINITIONS, BUILDING_DEFINITIONS };
export { calculateLevelFromXP, calculateXPForNextLevel, isChunkOrthogonallyAdjacent };
export * from './farmTypes';
