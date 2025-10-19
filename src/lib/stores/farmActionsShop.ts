import { get } from 'svelte/store';
import { gameState } from './farmState';
import { CROP_DEFINITIONS, TOOL_DEFINITIONS } from './farmDefinitions';
import { spendCoins } from './farmActionsBasic';

// ========== Shop Actions ==========

export function sellFood(foodType: string, quantity: number = 1): boolean {
    const state = get(gameState);
    const currentAmount = state.inventory.food[foodType] || 0;

    if (currentAmount < quantity) return false;

    const cropDef = CROP_DEFINITIONS.find((c) => c.id === foodType);
    if (!cropDef) return false;

    // Sell for the crop's harvest value
    const totalValue = cropDef.harvestValue * quantity;

    gameState.update((s) => {
        const newFood = { ...s.inventory.food };
        newFood[foodType] = currentAmount - quantity;
        if (newFood[foodType] === 0) {
            delete newFood[foodType];
        }
        return {
            ...s,
            coins: s.coins + totalValue,
            inventory: {
                ...s.inventory,
                food: newFood,
            },
        };
    });
    return true;
}

export function buyTool(toolId: string): boolean {
    const state = get(gameState);
    const toolDef = TOOL_DEFINITIONS.find((t) => t.id === toolId);

    if (!toolDef) return false;
    if (state.ownedTools.includes(toolId)) return false;
    if (toolDef.unlockLevel > state.level) return false;
    if (!spendCoins(toolDef.cost)) return false;

    gameState.update((s) => ({
        ...s,
        ownedTools: [...s.ownedTools, toolId],
    }));
    return true;
}

export function buySeed(seedId: string, quantity: number = 1): boolean {
    const seedDef = CROP_DEFINITIONS.find((c) => c.id === seedId);

    if (!seedDef) return false;
    const totalCost = seedDef.seedCost * quantity;
    if (!spendCoins(totalCost)) return false;

    gameState.update((s) => {
        const newInventory = { ...s.inventory };
        newInventory.seeds = { ...newInventory.seeds };
        newInventory.seeds[seedId] = (newInventory.seeds[seedId] || 0) + quantity;
        return { ...s, inventory: newInventory };
    });
    return true;
}
