<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import Stats from "./ui/Stats.svelte";
    import Toolbar from "./ui/Toolbar.svelte";
    import Market from "./ui/Market.svelte";
    import Notification from "./ui/Notification.svelte";
    import InventoryDialog from "./ui/InventoryDialog.svelte";
    import PauseMenu from "./ui/PauseMenu.svelte";
    import GameButton from "./ui/GameButton.svelte";
    import Panel from "./ui/Panel.svelte";

    const dispatch = createEventDispatcher();

    export let selectedTool: string;
    export let inventory: Record<string, number> = {};
    export let maxCapacity: number = 20;
    export let produceCount: number = 0;
    export let notification: string | null = null;

    let showMarket = false;
    let showInventory = false;
    let showPauseMenu = false;

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

    function handleKeydown(event: KeyboardEvent) {
        if (event.key.toLowerCase() === "e") {
            if (!showMarket && !showPauseMenu) {
                showInventory = !showInventory;
            }
        } else if (event.key === "Escape") {
            if (showMarket) showMarket = false;
            else if (showInventory) showInventory = false;
            else showPauseMenu = !showPauseMenu;
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeydown);
    });
</script>

<Notification message={notification} />

<Stats {inventory} {produceCount} {maxCapacity} />

<div class="top-right-actions">
    <GameButton
        variant="primary"
        onClick={() => (showMarket = true)}
        className="market-btn"
    >
        🏪
    </GameButton>
</div>

<Toolbar
    {selectedTool}
    {inventory}
    onSelectTool={(tool) => (selectedTool = tool)}
/>

{#if showInventory}
    <InventoryDialog {inventory} onClose={() => (showInventory = false)} />
{/if}

{#if showMarket}
    <Market
        {inventory}
        onClose={() => (showMarket = false)}
        onBuy={buy}
        onSell={sell}
    />
{/if}

{#if showPauseMenu}
    <PauseMenu
        onResume={() => (showPauseMenu = false)}
        onSave={() => {
            dispatch("save");
            showPauseMenu = false;
        }}
        onReset={() => {
            dispatch("delete");
            showPauseMenu = false;
        }}
    />
{/if}

<style>
    .top-right-actions {
        position: absolute;
        top: 20px;
        right: 0;
        z-index: 10;
    }

    :global(.market-btn) {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
        padding: 12px 16px !important;
        font-size: 1.5rem !important;
        box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.2) !important;
    }
</style>
