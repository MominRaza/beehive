<script lang="ts">
    import {
        gameState,
        availableSeeds,
        lockedSeeds,
        availableTools,
        lockedTools,
        availableTrees,
        lockedTrees,
        availableBuildings,
        lockedBuildings,
        availableChunks,
        selectSeed,
        selectTool,
        selectTree,
        selectBuilding,
        selectChunkForPurchase,
        buySeed,
        buyTool,
        buyChunk,
        sellFood,
    } from "../../stores/farm";
    import {
        SHOP_TABS,
        type ShopTab,
        createSeedOptions,
        createToolOptions,
        createTreeOptions,
        createBuildingOptions,
        createSellOptions,
        createChunkOptions,
    } from "./shop/shopData";
    import ShopTabs from "./shop/ShopTabs.svelte";
    import ShopSeedsTab from "./shop/ShopSeedsTab.svelte";
    import ShopToolsTab from "./shop/ShopToolsTab.svelte";
    import ShopTreesTab from "./shop/ShopTreesTab.svelte";
    import ShopBuildingsTab from "./shop/ShopBuildingsTab.svelte";
    import ShopSellTab from "./shop/ShopSellTab.svelte";
    import ShopChunksTab from "./shop/ShopChunksTab.svelte";

    let shopOpen = false;
    let activeTab: ShopTab = "seeds";
    let seedQuantities: Record<string, number> = {};
    let sellQuantities: Record<string, number> = {};

    $: coins = $gameState.coins;
    $: seedOptions = createSeedOptions($availableSeeds, seedQuantities, coins);
    $: toolOptions = createToolOptions(
        $availableTools,
        $gameState.ownedTools,
        $gameState.selectedTool,
        coins,
    );
    $: treeOptions = createTreeOptions(
        $availableTrees,
        $gameState.selectedTree,
        coins,
    );
    $: buildingOptions = createBuildingOptions(
        $availableBuildings,
        $gameState.selectedBuilding,
        coins,
        $gameState.inventory.wood,
    );
    $: sellOptions = createSellOptions($gameState, sellQuantities);
    $: chunkOptions = createChunkOptions($availableChunks, coins);

    function toggleShop(): void {
        shopOpen = !shopOpen;
    }

    function handleTabSelect(event: CustomEvent<ShopTab>): void {
        activeTab = event.detail;
    }

    function handleSeedQuantity(
        event: CustomEvent<{ id: string; value: number }>,
    ): void {
        const { id, value } = event.detail;
        seedQuantities = { ...seedQuantities, [id]: value };
    }

    function handleSeedPurchase(event: CustomEvent<string>): void {
        const seedId = event.detail;
        const quantity = seedQuantities[seedId] ?? 1;
        if (quantity <= 0) return;
        const option = seedOptions.find(
            (entry) => entry.definition.id === seedId,
        );
        if (!option || !option.canAfford) return;
        buySeed(seedId, quantity);
        selectSeed(seedId);
    }

    function handleToolAction(
        event: CustomEvent<{ id: string; owned: boolean }>,
    ): void {
        const { id, owned } = event.detail;
        if (owned) {
            selectTool($gameState.selectedTool === id ? null : id);
        } else {
            const option = toolOptions.find(
                (entry) => entry.definition.id === id,
            );
            if (option?.canAfford) {
                buyTool(id);
            }
        }
    }

    function handleTreeSelect(event: CustomEvent<string>): void {
        const treeId = event.detail;
        const option = treeOptions.find(
            (entry) => entry.definition.id === treeId,
        );
        if (
            !option?.canAfford &&
            option?.definition.id !== $gameState.selectedTree
        ) {
            return;
        }
        selectTree($gameState.selectedTree === treeId ? null : treeId);
    }

    function handleBuildingSelect(event: CustomEvent<string>): void {
        const buildingId = event.detail;
        const option = buildingOptions.find(
            (entry) => entry.definition.id === buildingId,
        );
        if (
            !option?.canAfford &&
            option?.definition.id !== $gameState.selectedBuilding
        ) {
            return;
        }
        selectBuilding(
            $gameState.selectedBuilding === buildingId ? null : buildingId,
        );
    }

    function handleSellQuantity(
        event: CustomEvent<{ id: string; value: number }>,
    ): void {
        const { id, value } = event.detail;
        sellQuantities = { ...sellQuantities, [id]: value };
    }

    function handleSell(event: CustomEvent<string>): void {
        const foodType = event.detail;
        const option = sellOptions.find((entry) => entry.id === foodType);
        if (!option || !option.canSell) return;
        sellFood(foodType, option.quantity);
    }

    function handleChunkInspect(event: CustomEvent<string>): void {
        selectChunkForPurchase(event.detail);
    }

    function handleChunkPurchase(event: CustomEvent<string>): void {
        const chunkId = event.detail;
        const option = chunkOptions.find((entry) => entry.chunk.id === chunkId);
        if (!option?.canAfford) return;
        buyChunk(chunkId);
    }
</script>

<div class="shop-root">
    <button class="shop-toggle" on:click={toggleShop} aria-expanded={shopOpen}>
        <span class="icon">🛒</span>
        <span class="label">{shopOpen ? "Hide" : "Shop"}</span>
    </button>

    <div class:open={shopOpen} class="shop-panel">
        <ShopTabs tabs={SHOP_TABS} {activeTab} on:select={handleTabSelect} />

        <section class="tab-content" aria-live="polite">
            {#if activeTab === "seeds"}
                <ShopSeedsTab
                    {seedOptions}
                    lockedSeeds={$lockedSeeds}
                    {coins}
                    on:quantity={handleSeedQuantity}
                    on:buy={handleSeedPurchase}
                />
            {:else if activeTab === "tools"}
                <ShopToolsTab
                    {toolOptions}
                    {coins}
                    lockedTools={$lockedTools}
                    on:action={handleToolAction}
                />
            {:else if activeTab === "trees"}
                <ShopTreesTab
                    {treeOptions}
                    lockedTrees={$lockedTrees}
                    on:select={handleTreeSelect}
                />
            {:else if activeTab === "buildings"}
                <ShopBuildingsTab
                    {buildingOptions}
                    lockedBuildings={$lockedBuildings}
                    on:select={handleBuildingSelect}
                />
            {:else if activeTab === "sell"}
                <ShopSellTab
                    {sellOptions}
                    on:quantity={handleSellQuantity}
                    on:sell={handleSell}
                />
            {:else if activeTab === "chunks"}
                <ShopChunksTab
                    {chunkOptions}
                    on:inspect={handleChunkInspect}
                    on:buy={handleChunkPurchase}
                />
            {/if}
        </section>
    </div>
</div>

<style>
    .shop-root {
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
        font-family: inherit;
    }

    .shop-toggle {
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.6rem 1rem;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 999px;
        color: white;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .shop-toggle:hover {
        background: rgba(30, 41, 59, 0.9);
    }

    .shop-panel {
        pointer-events: auto;
        width: 320px;
        max-height: 70vh;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        overflow: hidden;
        backdrop-filter: blur(12px);
        display: none;
        flex-direction: column;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    }

    .shop-panel.open {
        display: flex;
    }

    .tab-content {
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>
