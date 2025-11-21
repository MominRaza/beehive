<script lang="ts">
    import Panel from "./Panel.svelte";
    import GameButton from "./GameButton.svelte";
    import { inventory } from "../stores";

    export let onClose: () => void;

    $: produceItems = Object.entries($inventory).filter(
        ([item, count]) =>
            count > 0 && (item.includes("produce") || item === "wood"),
    );
</script>

<div class="inventory-overlay">
    <div class="inventory-modal">
        <Panel title="Inventory" className="inventory-panel">
            <div slot="header-actions">
                <GameButton variant="ghost" onClick={onClose}>✕</GameButton>
            </div>

            <div class="inventory-content">
                {#if produceItems.length === 0}
                    <div class="empty-state">
                        <span>Inventory is empty</span>
                        <small>Harvest crops or chop trees to get items</small>
                    </div>
                {:else}
                    <div class="grid">
                        {#each produceItems as [item, count]}
                            <div class="item-card">
                                <div class="item-icon">
                                    {#if item.includes("wheat")}🍞
                                    {:else if item.includes("carrot")}🥕
                                    {:else if item.includes("tomato")}🍅
                                    {:else if item.includes("wood")}🪵
                                    {/if}
                                </div>
                                <div class="item-info">
                                    <span class="name"
                                        >{item
                                            .replace("_produce", "")
                                            .replace("_", " ")}</span
                                    >
                                    <span class="count">x{count}</span>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="footer-hint">Press 'E' to close</div>
        </Panel>
    </div>
</div>

<style>
    .inventory-overlay {
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
        animation: fadeIn 0.2s ease;
    }

    .inventory-modal {
        width: 90%;
        max-width: 500px;
    }

    .inventory-content {
        min-height: 200px;
        max-height: 60vh;
        overflow-y: auto;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--color-text-muted);
        gap: 8px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 12px;
    }

    .item-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .item-icon {
        font-size: 2rem;
    }

    .item-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .name {
        font-size: 0.9rem;
        text-transform: capitalize;
        font-weight: 600;
    }

    .count {
        color: var(--color-text-muted);
        font-family: monospace;
    }

    .footer-hint {
        margin-top: 16px;
        text-align: center;
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
