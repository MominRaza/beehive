export type TileType = "dirt" | "grass" | "path";
export type CropType = "wheat" | "carrot" | "tomato";
export type TreeType = "oak" | "pine";
export type ToolType = "none" | TileType | "water" | CropType | TreeType | "harvest" | "axe";

export type InventoryItemType = "wheat_seed" | "carrot_seed" | "tomato_seed" | "oak_sapling" | "pine_sapling" | "wheat_produce" | "carrot_produce" | "tomato_produce" | "wood";

export interface InventoryState {
    [key: string]: number;
}

export const GROWTH_TIMES: Record<string, number> = {
    wheat: 2,
    carrot: 3,
    tomato: 5,
    oak: 10,
    pine: 12
};

export const PRICES: Record<string, { buy: number, sell: number }> = {
    "wheat_seed": { buy: 5, sell: -1 },
    "carrot_seed": { buy: 10, sell: -1 },
    "tomato_seed": { buy: 15, sell: -1 },
    "oak_sapling": { buy: 20, sell: -1 },
    "pine_sapling": { buy: 25, sell: -1 },
    "wheat_produce": { buy: -1, sell: 10 },
    "carrot_produce": { buy: -1, sell: 18 },
    "tomato_produce": { buy: -1, sell: 25 },
    "wood": { buy: -1, sell: 15 }
};

export const TILE_DIMENSIONS = {
    DIRT_HEIGHT: 0.1,
    GRASS_LAYER_HEIGHT: 0.1,
    PATH_LAYER_HEIGHT: 0.1,
};

export const SURFACE_HEIGHTS = {
    DIRT: TILE_DIMENSIONS.DIRT_HEIGHT,
    GRASS: TILE_DIMENSIONS.DIRT_HEIGHT + TILE_DIMENSIONS.GRASS_LAYER_HEIGHT,
    PATH: TILE_DIMENSIONS.DIRT_HEIGHT + TILE_DIMENSIONS.GRASS_LAYER_HEIGHT + TILE_DIMENSIONS.PATH_LAYER_HEIGHT,
};
