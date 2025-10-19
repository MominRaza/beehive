// ========== Types ==========

export interface CropDefinition {
    id: string;
    name: string;
    seedCost: number;
    growthTime: number; // in seconds
    harvestValue: number;
    harvestXP: number;
    unlockLevel: number;
}

export interface ToolDefinition {
    id: string;
    name: string;
    cost: number;
    unlockLevel: number;
    description: string;
}

export interface TreeDefinition {
    id: string;
    name: string;
    cost: number;
    growthTime: number; // in seconds
    harvestInterval: number; // for fruit trees
    woodYield: number; // wood from chopping
    fruitYield?: number; // for fruit trees
    fruitType?: string; // apple, orange, etc
    unlockLevel: number;
    description: string;
}

export interface BuildingDefinition {
    id: string;
    name: string;
    woodCost: number;
    coinCost: number;
    unlockLevel: number;
    description: string;
    storageBonus?: number; // extra storage slots
}

export interface Crop {
    type: string;
    plantedAt: number;
    growthProgress: number; // 0 to 1
}

export interface Tree {
    type: string;
    plantedAt: number;
    growthProgress: number; // 0 to 1
    lastHarvest?: number; // for fruit trees
}

export interface Building {
    type: string;
    builtAt: number;
}

export interface Placeable {
    x: number;
    z: number;
    type: 'tree' | 'building' | 'well';
    data: Tree | Building | null;
}

export interface FarmTile {
    x: number;
    z: number;
    isPlowed: boolean;
    crop: Crop | null;
    isLocked: boolean; // for chunk system
    chunkId?: string; // which chunk this belongs to
}

export interface Chunk {
    id: string;
    x: number; // chunk coordinate
    z: number; // chunk coordinate
    isOwned: boolean;
    cost: number;
}

export interface Inventory {
    seeds: Record<string, number>; // seedId -> quantity
    wood: number;
    food: Record<string, number>; // foodType -> quantity
}

export interface GameState {
    coins: number;
    xp: number;
    level: number;
    gridSize: number;
    tiles: FarmTile[];
    chunks: Chunk[];
    inventory: Inventory;
    placeables: Placeable[];
    selectedTileIndex: number | null;
    selectedSeed: string | null;
    selectedTool: string | null;
    selectedTree: string | null;
    selectedBuilding: string | null;
    selectedChunkId: string | null;
    ownedTools: string[];
    lastUpdateTime: number;
}
