<script lang="ts">
    import HudStatsPanel from "./hud/HudStatsPanel.svelte";
    import HudSelectionPanel from "./hud/HudSelectionPanel.svelte";
    import HudInventoryPanel from "./hud/HudInventoryPanel.svelte";
    import HudChunkPrompt from "./hud/HudChunkPrompt.svelte";
    import HudShopPanel from "./hud/HudShopPanel.svelte";
</script>

<div class="hud-root">
    <div class="hud-column hud-left">
        <HudStatsPanel />
        <HudSelectionPanel />
    </div>

    <div class="hud-column hud-right">
        <HudInventoryPanel />
    </div>

    <HudChunkPrompt />
    <HudShopPanel />
</div>

<style>
    .hud-root {
        position: absolute;
        inset: 0;
        pointer-events: none;
        color: white;
        font-family: inherit;
    }

    .hud-column {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .hud-column.hud-left {
        top: 1.5rem;
        left: 1.5rem;
    }

    .hud-column.hud-right {
        top: 1.5rem;
        right: 1.5rem;
    }

    :global(.hud-root button) {
        font-family: inherit;
    }
</style>
