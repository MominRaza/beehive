<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ChunkOption } from "./shopData";
    import { formatCoins } from "./shopData";

    export let chunkOptions: ChunkOption[] = [];

    const dispatch = createEventDispatcher<{
        inspect: string;
        buy: string;
    }>();

    function handleInspect(id: string): void {
        dispatch("inspect", id);
    }

    function handleBuy(id: string): void {
        dispatch("buy", id);
    }
</script>

{#if chunkOptions.length === 0}
    <p class="empty">All nearby chunks owned.</p>
{:else}
    {#each chunkOptions as option}
        <article class="item-card">
            <header class="item-header">
                <h3>Chunk ({option.chunk.x}, {option.chunk.z})</h3>
                <span class="cost">🪙 {formatCoins(option.chunk.cost)}</span>
            </header>
            <div class="actions">
                <button
                    class="secondary"
                    on:click={() => handleInspect(option.chunk.id)}
                >
                    Inspect
                </button>
                <button
                    class="primary"
                    disabled={!option.canAfford}
                    on:click={() => handleBuy(option.chunk.id)}
                >
                    Buy
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
        gap: 0.75rem;
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

    .actions {
        display: flex;
        gap: 0.5rem;
    }

    .primary,
    .secondary {
        border: none;
        padding: 0.5rem 0.9rem;
        border-radius: 0.6rem;
        cursor: pointer;
        transition:
            transform 0.2s ease,
            background 0.2s ease;
        font-weight: 600;
        color: white;
    }

    .primary {
        background: #3b82f6;
    }

    .primary:hover:not(:disabled) {
        background: #2563eb;
        transform: translateY(-1px);
    }

    .secondary {
        background: rgba(255, 255, 255, 0.15);
    }

    .secondary:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
    }

    button:disabled {
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
