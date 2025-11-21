import { get } from 'svelte/store';
import { inventory } from '../stores';
import type { InventoryState } from './types';

export class InventoryManager {
    private maxCapacity: number = 20; // Limit for produce/wood

    constructor() {
        // Initialize with starter coins and no items
        // We don't reset the store here because we might be loading a save
        // But if it's a new game, we might want to.
        // For now, let's assume the store is the source of truth.
        // Actually, let's reset it to ensure clean state on new manager
        inventory.set({ "coins": 100 });
    }

    addItem(item: string, count: number): boolean {
        if (this.isProduce(item)) {
            const currentProduceCount = this.getProduceCount();
            if (currentProduceCount + count > this.maxCapacity) {
                return false;
            }
        }

        inventory.update(items => {
            const newItems = { ...items };
            if (!newItems[item]) {
                newItems[item] = 0;
            }
            newItems[item] += count;
            return newItems;
        });
        return true;
    }

    removeItem(item: string, count: number): boolean {
        const items = get(inventory);
        if (!items[item] || items[item] < count) {
            return false;
        }

        inventory.update(currentItems => {
            const newItems = { ...currentItems };
            newItems[item] -= count;
            return newItems;
        });
        return true;
    }

    getCount(item: string): number {
        const items = get(inventory);
        return items[item] || 0;
    }

    getProduceCount(): number {
        const items = get(inventory);
        let count = 0;
        for (const key in items) {
            if (this.isProduce(key)) {
                count += items[key];
            }
        }
        return count;
    }

    getMaxCapacity(): number {
        return this.maxCapacity;
    }

    private isProduce(item: string): boolean {
        return item.includes('produce') || item === 'wood';
    }

    serialize(): InventoryState {
        return get(inventory);
    }

    load(data: InventoryState) {
        inventory.set({ ...data });
    }

    // subscribe method removed as we use the store directly in UI
}
