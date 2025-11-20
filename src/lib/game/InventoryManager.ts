import type { InventoryItemType, InventoryState } from './types';

export class InventoryManager {
    private items: InventoryState = {};
    private listeners: ((inventory: InventoryState) => void)[] = [];
    private maxCapacity: number = 20; // Limit for produce/wood

    constructor() {
        // Initialize with starter coins and no items
        this.items = {
            "coins": 100
        };
    }

    addItem(item: string, count: number): boolean {
        if (this.isProduce(item)) {
            const currentProduceCount = this.getProduceCount();
            if (currentProduceCount + count > this.maxCapacity) {
                return false;
            }
        }

        if (!this.items[item]) {
            this.items[item] = 0;
        }
        this.items[item] += count;
        this.notifyListeners();
        return true;
    }

    removeItem(item: string, count: number): boolean {
        if (!this.items[item] || this.items[item] < count) {
            return false;
        }
        this.items[item] -= count;
        this.notifyListeners();
        return true;
    }

    getCount(item: string): number {
        return this.items[item] || 0;
    }

    getProduceCount(): number {
        let count = 0;
        for (const key in this.items) {
            if (this.isProduce(key)) {
                count += this.items[key];
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
        return { ...this.items };
    }


    load(data: InventoryState) {
        this.items = { ...data };
        this.notifyListeners();
    }

    subscribe(listener: (inventory: InventoryState) => void) {
        this.listeners.push(listener);
        listener(this.items); // Initial call
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l(this.items));
    }
}
