<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { SellOption } from "./shopData";
    import { formatCoins } from "./shopData";

    export let sellOptions: SellOption[] = [];

    const dispatch = createEventDispatcher<{
        quantity: { id: string; value: number };
        sell: string;
    }>();

    function handleQuantity(id: string, value: number): void {
        dispatch("quantity", { id, value });
    }

    function handleSell(id: string): void {
        dispatch("sell", id);
    }
</script>

{#if sellOptions.length === 0}
    <p class="empty">No harvested food in storage.</p>
{:else}
    {#each sellOptions as option}
        <article class="item-card">
            <header class="item-header">
                <h3>{option.name}</h3>
                <span class="cost">Qty {option.amount}</span>
            </header>
            <p class="detail-line">
                Sell price: 🪙 {formatCoins(option.harvestValue)}
            </p>
            <div class="actions">
                <input
                    type="number"
                    min="1"
                    max={option.amount}
                    value={option.quantity}
                    on:input={(event) =>
                        handleQuantity(
                            option.id,
                            Number(event.currentTarget.value),
                        )}
                />
                <button
                    class="primary"
                    disabled={!option.canSell ||
                        option.quantity > option.amount ||
                        option.harvestValue <= 0}
                    on:click={() => handleSell(option.id)}
                >
                    Sell {option.quantity} ({formatCoins(option.totalValue)})
                </button>
            </div>
        </article>
    {/each}
{/if}

<style>
    .item-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 0.75rem;
        padding: 0.85rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }

    .cost {
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.75);
    }

    .detail-line {
        margin: 0;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.7);
    }

    .actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    input[type="number"] {
        width: 60px;
        padding: 0.35rem 0.4rem;
        background: rgba(15, 23, 42, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        color: white;
        font-size: 0.9rem;
        text-align: center;
    }

    input[type="number"]:focus {
        outline: none;
        border-color: rgba(59, 130, 246, 0.6);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    .primary {
        border: none;
        padding: 0.5rem 0.9rem;
        border-radius: 0.6rem;
        cursor: pointer;
        transition:
            transform 0.2s ease,
            background 0.2s ease;
        font-weight: 600;
        color: white;
        background: #3b82f6;
    }

    .primary:hover:not(:disabled) {
        background: #2563eb;
        transform: translateY(-1px);
    }

    .primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .empty {
        margin: 0.5rem 0;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
    }
</style>
