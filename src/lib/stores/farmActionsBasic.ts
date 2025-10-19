import { gameState } from './farmState';
import { calculateLevelFromXP } from './farmHelpers';

// ========== Basic Actions ==========

export function addCoins(amount: number): void {
    gameState.update((state) => ({
        ...state,
        coins: state.coins + amount,
    }));
}

export function spendCoins(amount: number): boolean {
    const state = get(gameState);
    if (state.coins >= amount) {
        gameState.update((s) => ({
            ...s,
            coins: s.coins - amount,
        }));
        return true;
    }
    return false;
}

export function addXP(amount: number): void {
    gameState.update((state) => {
        const newXP = state.xp + amount;
        const newLevel = calculateLevelFromXP(newXP);
        return {
            ...state,
            xp: newXP,
            level: newLevel,
        };
    });
}

export function updateLastTime(): void {
    gameState.update((state) => ({
        ...state,
        lastUpdateTime: Date.now(),
    }));
}

// ========== Selection Actions ==========

export function selectTile(index: number | null): void {
    gameState.update((state) => ({
        ...state,
        selectedTileIndex: index,
        selectedChunkId: null,
    }));
}

export function selectSeed(seedId: string | null): void {
    gameState.update((state) => ({
        ...state,
        selectedSeed: seedId,
        selectedTool: null,
        selectedTree: null,
        selectedBuilding: null,
        selectedChunkId: null,
    }));
}

export function selectTool(toolId: string | null): void {
    gameState.update((state) => ({
        ...state,
        selectedTool: toolId,
        selectedSeed: null,
        selectedTree: null,
        selectedBuilding: null,
        selectedChunkId: null,
    }));
}

export function selectTree(treeId: string | null): void {
    gameState.update((state) => ({
        ...state,
        selectedTree: treeId,
        selectedSeed: null,
        selectedTool: null,
        selectedBuilding: null,
        selectedChunkId: null,
    }));
}

export function selectBuilding(buildingId: string | null): void {
    gameState.update((state) => ({
        ...state,
        selectedBuilding: buildingId,
        selectedSeed: null,
        selectedTool: null,
        selectedTree: null,
        selectedChunkId: null,
    }));
}

export function selectChunkForPurchase(chunkId: string | null): void {
    gameState.update((state) => ({
        ...state,
        selectedChunkId: chunkId,
        selectedTileIndex: null,
        selectedSeed: null,
        selectedTool: null,
        selectedTree: null,
        selectedBuilding: null,
    }));
}

// Fix import
import { get } from 'svelte/store';
