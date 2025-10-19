<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ShopTab, ShopTabInfo } from "./shopData";

    export let tabs: ShopTabInfo[] = [];
    export let activeTab: ShopTab;

    const dispatch = createEventDispatcher<{ select: ShopTab }>();

    function handleClick(tabId: ShopTab): void {
        dispatch("select", tabId);
    }
</script>

<nav class="shop-tabs" aria-label="Shop categories">
    {#each tabs as tab}
        <button
            type="button"
            class="tab-button"
            class:active={activeTab === tab.id}
            on:click={() => handleClick(tab.id)}
        >
            <span class="tab-icon">{tab.icon}</span>
            <span class="tab-label">{tab.label}</span>
        </button>
    {/each}
</nav>

<style>
    .shop-tabs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(15, 23, 42, 0.95);
    }

    .tab-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
        padding: 0.75rem 0.5rem;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: background 0.2s ease;
        font-size: 0.85rem;
    }

    .tab-button:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    .tab-button.active {
        color: white;
        background: rgba(59, 130, 246, 0.18);
    }

    .tab-icon {
        font-size: 1.1rem;
    }
</style>
