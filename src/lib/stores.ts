import { writable, derived } from 'svelte/store';
import type { InventoryState } from './game/types';

// Initial state
const initialInventory: InventoryState = {
    "coins": 100
};

export const inventory = writable<InventoryState>(initialInventory);

export const produceCount = derived(inventory, ($inventory) => {
    let count = 0;
    for (const key in $inventory) {
        if (key.includes('produce') || key === 'wood') {
            count += $inventory[key];
        }
    }
    return count;
});

export const maxCapacity = writable(20);

export const notification = writable<string | null>(null);

// Helper to show notification with auto-hide
export function showNotification(message: string, duration = 2000) {
    notification.set(message);
    setTimeout(() => {
        notification.update(n => n === message ? null : n);
    }, duration);
}
