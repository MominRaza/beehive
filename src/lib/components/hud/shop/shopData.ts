import {
    CROP_DEFINITIONS,
    type BuildingDefinition,
    type Chunk,
    type CropDefinition,
    type GameState,
    type ToolDefinition,
    type TreeDefinition,
} from "../../../stores/farm";

export type ShopTab =
    | "seeds"
    | "tools"
    | "trees"
    | "buildings"
    | "sell"
    | "chunks";

export interface ShopTabInfo {
    id: ShopTab;
    icon: string;
    label: string;
}

export const SHOP_TABS: ShopTabInfo[] = [
    { id: "seeds", icon: "🌱", label: "Seeds" },
    { id: "tools", icon: "🛠️", label: "Tools" },
    { id: "trees", icon: "🌳", label: "Trees" },
    { id: "buildings", icon: "🏠", label: "Buildings" },
    { id: "sell", icon: "💰", label: "Sell" },
    { id: "chunks", icon: "🗺️", label: "Chunks" },
];

export interface SeedOption {
    definition: CropDefinition;
    quantity: number;
    totalCost: number;
    canAfford: boolean;
}

export interface ToolOption {
    definition: ToolDefinition;
    owned: boolean;
    selected: boolean;
    canAfford: boolean;
}

export interface TreeOption {
    definition: TreeDefinition;
    selected: boolean;
    canAfford: boolean;
}

export interface BuildingOption {
    definition: BuildingDefinition;
    selected: boolean;
    canAfford: boolean;
}

export interface SellOption {
    id: string;
    name: string;
    amount: number;
    quantity: number;
    harvestValue: number;
    totalValue: number;
    canSell: boolean;
}

export interface ChunkOption {
    chunk: Chunk;
    canAfford: boolean;
}

export function formatCoins(amount: number): string {
    return amount.toLocaleString();
}

function clamp(value: number | undefined, min: number, max: number): number {
    if (!Number.isFinite(value ?? Number.NaN)) {
        return min;
    }
    const numeric = value ?? min;
    return Math.min(Math.max(numeric, min), max);
}

export function createSeedOptions(
    seeds: CropDefinition[],
    quantities: Record<string, number>,
    coins: number,
): SeedOption[] {
    return seeds.map((seed) => {
        const quantity = clamp(quantities[seed.id], 1, 99);
        const totalCost = seed.seedCost * quantity;
        return {
            definition: seed,
            quantity,
            totalCost,
            canAfford: coins >= totalCost,
        };
    });
}

export function createToolOptions(
    tools: ToolDefinition[],
    ownedTools: string[],
    selectedTool: string | null,
    coins: number,
): ToolOption[] {
    return tools.map((tool) => {
        const owned = ownedTools.includes(tool.id);
        const canAfford = owned || coins >= tool.cost;
        return {
            definition: tool,
            owned,
            selected: selectedTool === tool.id,
            canAfford,
        };
    });
}

export function createTreeOptions(
    trees: TreeDefinition[],
    selectedTree: string | null,
    coins: number,
): TreeOption[] {
    return trees.map((tree) => ({
        definition: tree,
        selected: selectedTree === tree.id,
        canAfford: coins >= tree.cost,
    }));
}

export function createBuildingOptions(
    buildings: BuildingDefinition[],
    selectedBuilding: string | null,
    coins: number,
    wood: number,
): BuildingOption[] {
    return buildings.map((building) => ({
        definition: building,
        selected: selectedBuilding === building.id,
        canAfford: coins >= building.coinCost && wood >= building.woodCost,
    }));
}

export function createSellOptions(
    state: GameState,
    quantities: Record<string, number>,
): SellOption[] {
    return Object.entries(state.inventory.food).map(([foodType, amount]) => {
        const quantity = clamp(quantities[foodType], 1, amount);
        const crop = CROP_DEFINITIONS.find((entry) => entry.id === foodType);
        const harvestValue = crop?.harvestValue ?? 0;
        const totalValue = harvestValue * quantity;
        return {
            id: foodType,
            name: crop?.name ?? foodType,
            amount,
            quantity,
            harvestValue,
            totalValue,
            canSell: harvestValue > 0 && amount > 0,
        };
    });
}

export function createChunkOptions(
    chunks: Chunk[],
    coins: number,
): ChunkOption[] {
    return chunks.map((chunk) => ({
        chunk,
        canAfford: coins >= chunk.cost,
    }));
}
