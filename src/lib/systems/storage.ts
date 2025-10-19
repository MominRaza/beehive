import type { GameState } from '../stores/farm';

const STORAGE_KEY = 'beehive_farm_save';

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): boolean {
    try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serialized);
        return true;
    } catch (error) {
        console.error('Failed to save game state:', error);
        return false;
    }
}

/**
 * Load game state from localStorage
 */
export function loadGameState(): GameState | null {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (!serialized) return null;

        const state = JSON.parse(serialized);
        // Ensure lastUpdateTime is current to prevent huge time jumps
        state.lastUpdateTime = Date.now();
        return state;
    } catch (error) {
        console.error('Failed to load game state:', error);
        return null;
    }
}

/**
 * Clear saved game state
 */
export function clearGameState(): boolean {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear game state:', error);
        return false;
    }
}

/**
 * Check if a saved game exists
 */
export function hasSavedGame(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
}
