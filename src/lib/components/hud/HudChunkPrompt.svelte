<script lang="ts">
    import { gameState, availableChunks, buyChunk } from "../../stores/farm";

    $: selectedChunk = $gameState.selectedChunkId
        ? $gameState.chunks.find(
              (chunk) => chunk.id === $gameState.selectedChunkId,
          ) || null
        : null;

    $: isAvailable = selectedChunk
        ? $availableChunks.some((chunk) => chunk.id === selectedChunk.id)
        : false;

    $: canAfford = selectedChunk
        ? $gameState.coins >= selectedChunk.cost
        : false;

    function handlePurchase() {
        if (!selectedChunk || !isAvailable || !canAfford) {
            return;
        }
        buyChunk(selectedChunk.id);
    }
</script>

{#if selectedChunk}
    <div class="chunk-prompt">
        <div class="header">Unlock Chunk</div>
        <p class="coords">
            Coordinates: ({selectedChunk.x}, {selectedChunk.z})
        </p>
        <p class="cost">Cost: {selectedChunk.cost.toLocaleString()} coins</p>

        {#if !isAvailable}
            <p class="warning">Chunk must touch owned territory.</p>
        {:else if !canAfford}
            <p class="warning">Not enough coins.</p>
        {/if}

        <button
            class="buy-button"
            on:click={handlePurchase}
            disabled={!isAvailable || !canAfford}
        >
            Purchase
        </button>
    </div>
{/if}

<style>
    .chunk-prompt {
        position: absolute;
        bottom: 1.5rem;
        left: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.25rem;
        background: rgba(17, 24, 39, 0.85);
        border-radius: 0.75rem;
        color: white;
        min-width: 240px;
        pointer-events: auto;
        border: 1px solid rgba(59, 130, 246, 0.35);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.45);
    }

    .header {
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        opacity: 0.85;
    }

    .coords,
    .cost {
        font-size: 0.85rem;
        opacity: 0.85;
    }

    .warning {
        font-size: 0.8rem;
        color: #f87171;
    }

    .buy-button {
        margin-top: 0.25rem;
        padding: 0.6rem 1rem;
        border: none;
        border-radius: 0.5rem;
        background: #22c55e;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition:
            background 0.2s ease,
            transform 0.2s ease;
    }

    .buy-button:hover:enabled {
        background: #16a34a;
        transform: translateY(-1px);
    }

    .buy-button:disabled {
        background: rgba(148, 163, 184, 0.5);
        cursor: not-allowed;
    }
</style>
