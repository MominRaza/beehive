# Beehive 🐝

A relaxing 3D farming simulation game built with **Svelte**, **Three.js**, and **TypeScript**.


## 🎮 Gameplay Features

### 1. Farming System
*   **Seeds:** Seeds must be purchased from the market.
*   **Planting:** Plant crops on dirt tiles.
*   **Growth:** Crops grow over time through 3 distinct stages (Sprout -> Growing -> Mature).
*   **Harvesting:** Collect produce from fully grown crops to sell or replant.
*   **Watering:** Water your crops to darken the soil (Visual effect).

### 2. Forestry System
*   **Saplings:** Saplings must be purchased from the market.
*   **Tree Planting:** Plant tree saplings on grass tiles.
*   **Woodcutting:** Chop down fully grown trees to collect Wood.

### 3. Terraforming
*   **Grid Customization:** Modify the terrain by placing different tile types:
    *   **Dirt:** Required for farming.
    *   **Grass:** Required for planting trees.
    *   **Path:** Decorative walkways.

### 4. Economy & Market
*   **Trading:** Buy seeds and saplings; sell produce and wood.
*   **Currency:** Earn Coins by selling your harvest.
*   **Dynamic Prices:** Different crops have different buy/sell values and growth times.

### 5. Inventory Management
*   **Storage:** Limited inventory capacity for produce and wood (Max: 20 items).
*   **Resources:** Track your seeds, saplings, produce, wood, and coins.

### 6. Persistence
*   **Save/Load:** Your farm layout, crop progress, and inventory are saved locally.


## 🧠 Code Logic & Mechanics

### Core Systems

#### 1. Grid System (`GridManager.ts`)
The world is built on a coordinate-based grid system.
*   **Logic:** Stores tiles in a Map using `${x},${z}` keys.
*   **Tile Types:**
    *   `dirt`: Height 0.1, Brown. Can be watered.
    *   `grass`: Height 0.3, Green.
    *   `path`: Height 0.4, Grey.
*   **Watering:** Changes dirt color to darker brown (`0x5c2e0e`). Currently purely cosmetic.

#### 2. Interaction System (`GameManager.ts`)
Handles all player inputs and tool usage.
*   **Hut Protection:** Interaction is **blocked** within a 1.5 unit radius of the center (0,0) to preserve the starting hut.
*   **Tool Validation:**
    *   Checks if the player has the required item (e.g., Seed for planting).
    *   Checks if the target tile is valid (e.g., Dirt for crops, Grass for trees).
    *   Checks inventory space before harvesting.

#### 3. Growth System (`CropManager.ts` & `TreeManager.ts`)
*   **Logic:** Uses a simple timer-based system updated every frame.
*   **Stages:**
    *   Stage 0: Sprout/Sapling.
    *   Stage 1: Mid-growth.
    *   Stage 2: Fully Grown (Harvestable).
*   **Timers:**
    *   Wheat: 2 seconds.
    *   Carrot: 3 seconds.
    *   Tomato: 5 seconds.
    *   Tree: 10 seconds.

#### 4. Inventory System (`InventoryManager.ts`)
*   **Capacity:** Hard limit of **20 items** for "produce" (crops + wood). Seeds and saplings do not count towards this limit.
*   **Coins:** Infinite capacity.
*   **Logic:** Prevents adding items if capacity is reached.


## 📋 Conditions & Rules

### Planting Crops
*   **Condition:** Tool = `wheat` | `carrot` | `tomato`.
*   **Where:** Must be on a `dirt` tile.
*   **Requirement:** Must have at least 1 seed of that type in inventory.
*   **Outcome:** -1 Seed, +1 Crop entity.

### Planting Trees
*   **Condition:** Tool = `tree`.
*   **Where:** Must be on a `grass` tile.
*   **Requirement:** Must have at least 1 `tree_sapling`.
*   **Outcome:** -1 Sapling, +1 Tree entity.

### Harvesting Crops
*   **Condition:** Tool = `harvest`.
*   **Where:** On a fully grown crop (Stage 2).
*   **Requirement:** Inventory `produceCount` < `maxCapacity` (20).
*   **Outcome:** Crop removed, +1 Produce in inventory.

### Chopping Trees
*   **Condition:** Tool = `axe`.
*   **Where:** On a fully grown tree.
*   **Requirement:** Inventory must have space for **2 items**.
*   **Outcome:** Tree removed, +2 Wood.

### Terraforming
*   **Condition:** Tool = `dirt` | `grass` | `path`.
*   **Requirement:** Tile must be empty (no crops or trees).
*   **Outcome:** Replaces the tile type.

### Buying Items
*   **Condition:** Market Open.
*   **Requirement:** `coins` >= Item Price.
*   **Outcome:** -Coins, +Item.

### Selling Items
*   **Condition:** Market Open.
*   **Requirement:** Item count > 0.
*   **Outcome:** -1 Item, +Coins.


## 🚀 Getting Started

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository.
2.  Install dependencies:

```bash
bun install
```

### Running the Game

Start the development server:

```bash
bun run dev
```

Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

## 🕹️ Controls

*   **Left Click**: Interact with the grid (Select tool from HUD first).
*   **Right Click / Drag**: Pan the camera.
*   **Scroll**: Zoom in/out.
