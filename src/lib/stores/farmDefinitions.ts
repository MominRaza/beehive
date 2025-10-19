import type { CropDefinition, ToolDefinition, TreeDefinition, BuildingDefinition } from './farmTypes';

// ========== Crop Definitions ==========

export const CROP_DEFINITIONS: CropDefinition[] = [
    // Starter crops (unlocked at level 1)
    {
        id: 'wheat',
        name: 'Wheat',
        seedCost: 10,
        growthTime: 20, // 20 seconds
        harvestValue: 25,
        harvestXP: 5,
        unlockLevel: 1,
    },
    {
        id: 'carrot',
        name: 'Carrot',
        seedCost: 15,
        growthTime: 25,
        harvestValue: 35,
        harvestXP: 8,
        unlockLevel: 1,
    },
    {
        id: 'potato',
        name: 'Potato',
        seedCost: 20,
        growthTime: 30,
        harvestValue: 45,
        harvestXP: 10,
        unlockLevel: 1,
    },
    // Advanced crops (unlock at higher levels)
    {
        id: 'tomato',
        name: 'Tomato',
        seedCost: 30,
        growthTime: 35,
        harvestValue: 60,
        harvestXP: 15,
        unlockLevel: 3,
    },
    {
        id: 'corn',
        name: 'Corn',
        seedCost: 40,
        growthTime: 40,
        harvestValue: 80,
        harvestXP: 20,
        unlockLevel: 5,
    },
    {
        id: 'pumpkin',
        name: 'Pumpkin',
        seedCost: 60,
        growthTime: 50,
        harvestValue: 120,
        harvestXP: 30,
        unlockLevel: 8,
    },
];

// ========== Tool Definitions ==========

export const TOOL_DEFINITIONS: ToolDefinition[] = [
    {
        id: 'hoe',
        name: 'Hoe',
        cost: 0, // Free starter tool
        unlockLevel: 1,
        description: 'Plow tiles to prepare for planting',
    },
    {
        id: 'watering_can',
        name: 'Watering Can',
        cost: 50,
        unlockLevel: 2,
        description: 'Speed up crop growth by 20%',
    },
    {
        id: 'scythe',
        name: 'Scythe',
        cost: 150,
        unlockLevel: 4,
        description: 'Harvest crops instantly',
    },
    {
        id: 'axe',
        name: 'Axe',
        cost: 100,
        unlockLevel: 3,
        description: 'Chop trees for wood',
    },
];

// ========== Tree Definitions ==========

export const TREE_DEFINITIONS: TreeDefinition[] = [
    {
        id: 'pine',
        name: 'Pine Tree',
        cost: 50,
        growthTime: 60, // 60 seconds
        harvestInterval: 0, // wood only
        woodYield: 10,
        unlockLevel: 2,
        description: 'Produces wood when chopped',
    },
    {
        id: 'oak',
        name: 'Oak Tree',
        cost: 80,
        growthTime: 90,
        harvestInterval: 0,
        woodYield: 15,
        unlockLevel: 4,
        description: 'Produces more wood when chopped',
    },
    {
        id: 'apple',
        name: 'Apple Tree',
        cost: 120,
        growthTime: 120,
        harvestInterval: 40, // produces apples every 40s
        woodYield: 8,
        fruitYield: 3,
        fruitType: 'apple',
        unlockLevel: 5,
        description: 'Produces apples and wood',
    },
    {
        id: 'orange',
        name: 'Orange Tree',
        cost: 150,
        growthTime: 120,
        harvestInterval: 50,
        woodYield: 8,
        fruitYield: 4,
        fruitType: 'orange',
        unlockLevel: 6,
        description: 'Produces oranges and wood',
    },
];

// ========== Building Definitions ==========

export const BUILDING_DEFINITIONS: BuildingDefinition[] = [
    {
        id: 'seed_storage',
        name: 'Seed Storage',
        woodCost: 20,
        coinCost: 100,
        unlockLevel: 3,
        description: 'Increases seed inventory capacity',
        storageBonus: 50,
    },
    {
        id: 'barn',
        name: 'Barn',
        woodCost: 50,
        coinCost: 300,
        unlockLevel: 5,
        description: 'Stores crops and food',
        storageBonus: 100,
    },
    {
        id: 'well',
        name: 'Well',
        woodCost: 30,
        coinCost: 200,
        unlockLevel: 4,
        description: 'Increases crop growth by 10%',
    },
];
