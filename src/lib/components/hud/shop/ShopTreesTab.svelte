<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { TreeDefinition } from "../../../stores/farm";
    import type { TreeOption } from "./shopData";
    import { formatCoins } from "./shopData";

    export let treeOptions: TreeOption[] = [];
    export let lockedTrees: TreeDefinition[] = [];

    const dispatch = createEventDispatcher<{ select: string }>();

    function handleSelect(id: string): void {
        dispatch("select", id);
    }
</script>

{#each treeOptions as option}
    <article
        class="item-card"
        class:selected={option.selected}
        class:disabled={!option.canAfford && !option.selected}
    >
        <header class="item-header">
            <h3>{option.definition.name}</h3>
            <span class="cost">🪙 {formatCoins(option.definition.cost)}</span>
        </header>
        <p class="detail-line">
            Growth: {option.definition.growthTime}s · Wood: {option.definition
                .woodYield}
        </p>
        {#if option.definition.fruitYield}
            <p class="detail-line">
                Fruit: {option.definition.fruitYield} every {option.definition
                    .harvestInterval}s
            </p>
        {/if}
        <button
            class="secondary"
            disabled={!option.canAfford && !option.selected}
            on:click={() => handleSelect(option.definition.id)}
        >
            {option.selected ? "Selected" : "Select"}
        </button>
    </article>
{/each}

{#if lockedTrees.length > 0}
    <h4 class="locked-heading">Locked Trees</h4>
    {#each lockedTrees as tree}
        <article class="item-card locked">
            <header class="item-header">
                <h3>{tree.name}</h3>
                <span class="cost">🔒 Lv {tree.unlockLevel}</span>
            </header>
            <p class="detail-line">{tree.description}</p>
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

    .item-card.locked {
        opacity: 0.45;
    }

    .item-card.selected {
        border-color: rgba(74, 222, 128, 0.7);
        background: rgba(74, 222, 128, 0.15);
    }

    .item-card.disabled {
        opacity: 0.6;
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
        background: rgba(255, 255, 255, 0.15);
    }

    .secondary:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
    }

    .secondary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    .locked-heading {
        margin: 0.5rem 0;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(255, 255, 255, 0.5);
    }
</style>
