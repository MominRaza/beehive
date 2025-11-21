<script lang="ts">
    import Panel from "./Panel.svelte";
    import GameButton from "./GameButton.svelte";
    import { PRICES } from "../game/types";
    import { inventory } from "../stores";

    export let onClose: () => void;
    export let onBuy: (item: string) => void;
    export let onSell: (item: string) => void;

    // Helper to format item names
    const formatName = (name: string) =>
        name
            .replace("_seed", "")
            .replace("_sapling", "")
            .replace("_produce", "")
            .replace("_", " ");
</script>

<div
    class="market-overlay"
    role="button"
    tabindex="0"
    on:click|self={onClose}
    on:keydown={(e) => e.key === "Escape" && onClose()}
>
    <div class="market-sidebar">
        <Panel title="Village Market" className="market-panel">
            <div slot="header-actions">
                <GameButton variant="ghost" onClick={onClose}>✕</GameButton>
            </div>

            <div class="market-content">
                <div class="section">
                    <h4>🌱 Seeds & Saplings</h4>
                    <div class="grid">
                        {#each Object.entries(PRICES) as [item, price]}
                            {#if price.buy > 0}
                                <div class="card">
                                    <div class="card-icon">
                                        {#if item.includes("wheat")}🌾
                                        {:else if item.includes("carrot")}🥕
                                        {:else if item.includes("tomato")}🍅
                                        {:else if item.includes("tree")}🌲
                                        {/if}
                                    </div>
                                    <div class="card-info">
                                        <span class="name"
                                            >{formatName(item)}</span
                                        >
                                        <span class="price">🪙 {price.buy}</span
                                        >
                                    </div>
                                    <GameButton
                                        variant="primary"
                                        disabled={$inventory["coins"] <
                                            price.buy}
                                        onClick={() => onBuy(item)}
                                        className="action-btn"
                                    >
                                        Buy
                                    </GameButton>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>

                <div class="divider"></div>

                <div class="section">
                    <h4>📦 Sell Produce</h4>
                    <div class="grid">
                        {#each Object.entries(PRICES) as [item, price]}
                            {#if price.sell > 0 && (item.includes("produce") || item === "wood")}
                                <div class="card">
                                    <div class="card-icon">
                                        {#if item.includes("wheat")}🍞
                                        {:else if item.includes("carrot")}🥕
                                        {:else if item.includes("tomato")}🍅
                                        {:else if item.includes("wood")}🪵
                                        {/if}
                                    </div>
                                    <div class="card-info">
                                        <span class="name"
                                            >{formatName(item)}</span
                                        >
                                        <span class="price sell-price"
                                            >🪙 {price.sell}</span
                                        >
                                    </div>
                                    <GameButton
                                        variant="secondary"
                                        disabled={!$inventory[item] ||
                                            $inventory[item] <= 0}
                                        onClick={() => onSell(item)}
                                        className="action-btn"
                                    >
                                        Sell ({$inventory[item] || 0})
                                    </GameButton>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            </div>
        </Panel>
    </div>
</div>

<style>
    .market-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--overlay-bg);
        backdrop-filter: var(--overlay-blur);
        display: flex;
        justify-content: flex-end;
        z-index: 50;
        animation: fadeIn 0.2s ease;
    }

    .market-sidebar {
        width: 400px;
        height: 100%;
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :global(.market-panel) {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-radius: 0 !important;
        border-right: none !important;
        border-top: none !important;
        border-bottom: none !important;
    }

    :global(.market-panel .panel-content) {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .market-content {
        overflow-y: auto;
        padding-right: 4px;
        flex: 1;
    }

    h4 {
        margin: 0 0 12px 0;
        color: var(--color-text-muted);
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
    }

    .card {
        background: var(--glass-bg-light);
        border: var(--glass-border-faint);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        transition: transform 0.2s;
    }

    .card:hover {
        background: var(--glass-bg-hover);
        transform: translateY(-2px);
    }

    .card-icon {
        font-size: 2rem;
    }

    .card-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        width: 100%;
    }

    .name {
        font-weight: 600;
        text-transform: capitalize;
    }

    .price {
        color: var(--color-accent);
        font-family: monospace;
        font-weight: 700;
    }

    .sell-price {
        color: var(--color-primary);
    }

    .divider {
        height: 1px;
        background: var(--divider-color);
        margin: 24px 0;
    }

    :global(.action-btn) {
        width: 100%;
        margin-top: 4px;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
</style>
