<script lang="ts">
    import {
        gameState,
        selectSeed,
        selectTool,
        selectTree,
        selectBuilding,
        selectChunkForPurchase,
    } from "../../stores/farm";

    function clearAllSelections() {
        selectSeed(null);
        selectTool(null);
        selectTree(null);
        selectBuilding(null);
        selectChunkForPurchase(null);
    }

    function clearSeed() {
        selectSeed(null);
    }

    function clearTool() {
        selectTool(null);
    }

    function clearTree() {
        selectTree(null);
    }

    function clearBuilding() {
        selectBuilding(null);
    }

    function clearChunk() {
        selectChunkForPurchase(null);
    }

    $: selectedSeed = $gameState.selectedSeed;
    $: selectedTool = $gameState.selectedTool;
    $: selectedTree = $gameState.selectedTree;
    $: selectedBuilding = $gameState.selectedBuilding;
    $: chunkSelection = $gameState.selectedChunkId
        ? $gameState.chunks.find((c) => c.id === $gameState.selectedChunkId) ||
          null
        : null;

    $: hasSelection = Boolean(
        selectedSeed ||
            selectedTool ||
            selectedTree ||
            selectedBuilding ||
            chunkSelection,
    );
</script>

<div class="panel selection-panel">
    <header>Selections</header>

    {#if !hasSelection}
        <p class="empty">Nothing selected</p>
    {/if}

    {#if selectedTool}
        <div class="selection-row">
            <div class="selection-info">
                <span class="label">Tool</span>
                <span class="value">{selectedTool}</span>
            </div>
            <button class="clear" on:click={clearTool}>Clear</button>
        </div>
    {/if}

    {#if selectedSeed}
        <div class="selection-row">
            <div class="selection-info">
                <span class="label">Seed</span>
                <span class="value">{selectedSeed}</span>
            </div>
            <button class="clear" on:click={clearSeed}>Clear</button>
        </div>
    {/if}

    {#if selectedTree}
        <div class="selection-row">
            <div class="selection-info">
                <span class="label">Tree</span>
                <span class="value">{selectedTree}</span>
            </div>
            <button class="clear" on:click={clearTree}>Clear</button>
        </div>
    {/if}

    {#if selectedBuilding}
        <div class="selection-row">
            <div class="selection-info">
                <span class="label">Building</span>
                <span class="value">{selectedBuilding}</span>
            </div>
            <button class="clear" on:click={clearBuilding}>Clear</button>
        </div>
    {/if}

    {#if chunkSelection}
        <div class="selection-row chunk-row">
            <div class="selection-info">
                <span class="label">Chunk</span>
                <span class="value">{chunkSelection.id}</span>
            </div>
            <button class="clear" on:click={clearChunk}>Clear</button>
        </div>
    {/if}

    {#if hasSelection}
        <button class="clear-all" on:click={clearAllSelections}
            >Clear All</button
        >
    {/if}
</div>

<style>
    .panel {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.65);
        border-radius: 0.75rem;
        color: white;
        min-width: 220px;
        pointer-events: auto;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    }

    header {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.85;
    }

    .empty {
        font-size: 0.85rem;
        opacity: 0.7;
    }

    .selection-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 0.75rem;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 0.5rem;
    }

    .selection-info {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    .label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.75;
    }

    .value {
        font-weight: 600;
        font-size: 0.95rem;
        word-break: break-word;
    }

    .clear {
        padding: 0.35rem 0.75rem;
        border: none;
        border-radius: 0.45rem;
        background: rgba(248, 113, 113, 0.3);
        color: white;
        font-size: 0.75rem;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .clear:hover {
        background: rgba(248, 113, 113, 0.5);
    }

    .clear-all {
        align-self: flex-start;
        padding: 0.45rem 0.9rem;
        border: none;
        border-radius: 0.5rem;
        background: rgba(59, 130, 246, 0.35);
        color: white;
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .clear-all:hover {
        background: rgba(59, 130, 246, 0.55);
    }

    .chunk-row {
        border: 1px solid rgba(96, 165, 250, 0.35);
        background: rgba(37, 99, 235, 0.2);
    }
</style>
