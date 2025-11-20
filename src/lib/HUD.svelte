<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { PRICES } from "./game/types";
    const dispatch = createEventDispatcher();

    export let selectedTool:
        | "none"
        | "dirt"
        | "grass"
        | "path"
        | "water"
        | "wheat"
        | "carrot"
        | "tomato"
        | "tree"
        | "harvest"
        | "axe";

    export let inventory: Record<string, number> = {};
    export let maxCapacity: number = 20;
    export let produceCount: number = 0;
    export let notification: string | null = null;

    let showMarket = false;

    $: if (notification) {
        setTimeout(() => {
            notification = null;
        }, 2000);
    }

    function buy(item: string) {
        dispatch("buy", { item });
    }

    function sell(item: string) {
        dispatch("sell", { item });
    }
</script>

{#if notification}
    <div class="notification">
        {notification}
    </div>
{/if}

{#if showMarket}
    <div class="market-overlay">
        <div class="market-panel">
            <h2>Market</h2>
            <button class="close-btn" on:click={() => (showMarket = false)}
                >X</button
            >

            <div class="market-section">
                <h3>Buy Seeds & Saplings</h3>
                <div class="market-grid">
                    {#each Object.entries(PRICES) as [item, price]}
                        {#if price.buy > 0}
                            <div class="market-item">
                                <span class="item-name"
                                    >{item
                                        .replace("_seed", "")
                                        .replace("_sapling", "")
                                        .replace("_", " ")}</span
                                >
                                <span class="item-price">{price.buy} Coins</span
                                >
                                <button
                                    on:click={() => buy(item)}
                                    disabled={inventory["coins"] < price.buy}
                                    >Buy</button
                                >
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>

            <div class="market-section">
                <h3>Sell Produce</h3>
                <div class="market-grid">
                    {#each Object.entries(PRICES) as [item, price]}
                        {#if price.sell > 0 && (item.includes("produce") || item === "wood")}
                            <div class="market-item">
                                <span class="item-name"
                                    >{item
                                        .replace("_produce", "")
                                        .replace("_", " ")}</span
                                >
                                <span class="item-price"
                                    >{price.sell} Coins</span
                                >
                                <button
                                    on:click={() => sell(item)}
                                    disabled={!inventory[item] ||
                                        inventory[item] <= 0}>Sell</button
                                >
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="top-hud">
    <div class="inventory-display">
        <div class="inventory-header">
            Coins: {inventory["coins"] || 0}
        </div>
        <div class="inventory-header">
            Storage: {produceCount} / {maxCapacity}
        </div>
        {#each Object.entries(inventory) as [item, count]}
            {#if count > 0 && (item.includes("produce") || item === "wood")}
                <div class="inventory-item">
                    <span class="item-name"
                        >{item.replace("_produce", "").replace("_", " ")}</span
                    >
                    <span class="item-count">{count}</span>
                </div>
            {/if}
        {/each}
    </div>
    <button on:click={() => (showMarket = !showMarket)}>Market</button>
    <button on:click={() => dispatch("save")}>Save</button>
    <button on:click={() => dispatch("delete")}>Delete</button>
</div>

<div class="hud">
    <div class="toolbar">
        <button
            class:active={selectedTool === "none"}
            on:click={() => (selectedTool = "none")}
        >
            None
        </button>
        <button
            class:active={selectedTool === "dirt"}
            on:click={() => (selectedTool = "dirt")}
        >
            Dirt
        </button>
        <button
            class:active={selectedTool === "grass"}
            on:click={() => (selectedTool = "grass")}
        >
            Grass
        </button>
        <button
            class:active={selectedTool === "path"}
            on:click={() => (selectedTool = "path")}
        >
            Path
        </button>
        <button
            class:active={selectedTool === "wheat"}
            on:click={() => (selectedTool = "wheat")}
        >
            Wheat ({inventory["wheat_seed"] || 0})
        </button>
        <button
            class:active={selectedTool === "carrot"}
            on:click={() => (selectedTool = "carrot")}
        >
            Carrot ({inventory["carrot_seed"] || 0})
        </button>
        <button
            class:active={selectedTool === "tomato"}
            on:click={() => (selectedTool = "tomato")}
        >
            Tomato ({inventory["tomato_seed"] || 0})
        </button>
        <button
            class:active={selectedTool === "tree"}
            on:click={() => (selectedTool = "tree")}
        >
            Tree ({inventory["tree_sapling"] || 0})
        </button>
        <button
            class:active={selectedTool === "water"}
            on:click={() => (selectedTool = "water")}
        >
            Water
        </button>
        <button
            class:active={selectedTool === "harvest"}
            on:click={() => (selectedTool = "harvest")}
        >
            Harvest
        </button>
        <button
            class:active={selectedTool === "axe"}
            on:click={() => (selectedTool = "axe")}
        >
            Axe
        </button>
    </div>
</div>

<style>
    .top-hud {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 10;
        display: flex;
        gap: 10px;
        align-items: flex-start;
    }

    .inventory-display {
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 8px;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-right: 10px;
        min-width: 150px;
    }

    .inventory-header {
        font-weight: bold;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        padding-bottom: 5px;
        margin-bottom: 5px;
    }

    .inventory-item {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 14px;
        text-transform: capitalize;
    }

    .hud {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
    }

    .toolbar {
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 8px;
    }

    button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #444;
        color: white;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }

    button:hover {
        background: #555;
    }

    button.active {
        background: #646cff;
        color: white;
    }

    .notification {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 24px;
        pointer-events: none;
        z-index: 100;
        animation: fadeOut 2s forwards;
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        70% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    .market-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 50;
    }

    .market-panel {
        background: #333;
        color: white;
        padding: 20px;
        border-radius: 10px;
        width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }

    .market-panel h2 {
        margin-top: 0;
        text-align: center;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
    }

    .market-section {
        margin-bottom: 20px;
    }

    .market-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
    }

    .market-item {
        background: #444;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        text-transform: capitalize;
    }

    .item-price {
        color: #ffd700;
        font-size: 14px;
    }
</style>
