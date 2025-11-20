# Beehive 🐝

A relaxing 3D farming simulation game built with **Svelte**, **Three.js**, and **TypeScript**.

## 🎮 Gameplay Features

*   **Farming System**: Till the land, plant seeds (Wheat, Carrot, Tomato), water them, and watch them grow.
*   **Forestry**: Plant tree saplings and harvest them for wood.
*   **Economy**:
    *   Start with 100 Coins.
    *   Buy seeds and saplings from the **Market**.
    *   Sell your harvested produce and wood for profit.
*   **Inventory & Storage**:
    *   Manage your resources.
    *   Store items in your Hut (Capacity limited to 20 items).
    *   Upgrade your strategy to maximize profit within storage limits.
*   **Save System**: Your progress (grid, crops, inventory, coins) is automatically saved to your browser's local storage.

## 🛠️ Tech Stack

*   **Framework**: [Svelte](https://svelte.dev/)
*   **3D Engine**: [Three.js](https://threejs.org/)
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Runtime**: Bun

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
