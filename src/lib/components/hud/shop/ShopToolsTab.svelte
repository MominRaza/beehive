<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ToolDefinition } from "../../../stores/farm";
    import type { ToolOption } from "./shopData";
    import { formatCoins } from "./shopData";

    export let toolOptions: ToolOption[] = [];
    export let lockedTools: ToolDefinition[] = [];
    export let coins = 0;

    const dispatch = createEventDispatcher<{
        action: { id: string; owned: boolean };
    }>();

    function handleClick(option: ToolOption): void {
        dispatch("action", { id: option.definition.id, owned: option.owned });
    }
</script>

{#each toolOptions as option}
    <article
        class="item-card"
        class:owned={option.owned}
        class:selected={option.selected}
    >
        <header class="item-header">
            <h3>{option.definition.name}</h3>
            {#if !option.owned}
                <span class="cost"
                    >🪙 {formatCoins(option.definition.cost)}</span
                >
            {/if}
        </header>
        <p class="detail-line">{option.definition.description}</p>
        <button
            class={option.owned ? "secondary" : "primary"}
            disabled={!option.owned &&
                (coins < option.definition.cost || !option.canAfford)}
            on:click={() => handleClick(option)}
        >
            {#if option.owned}
                {option.selected ? "Selected" : "Select"}
            {:else}
                Buy
            {/if}
        </button>
    </article>
{/each}

{#if lockedTools.length > 0}
    <h4 class="locked-heading">Locked Tools</h4>
    {#each lockedTools as tool}
        <article class="item-card locked">
            <header class="item-header">
                <h3>{tool.name}</h3>
                <span class="cost">🔒 Lv {tool.unlockLevel}</span>
            </header>
            <p class="detail-line">{tool.description}</p>
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

    .item-card.owned {
        border-color: rgba(59, 130, 246, 0.4);
    }

    .item-card.selected {
        border-color: rgba(74, 222, 128, 0.7);
        background: rgba(74, 222, 128, 0.15);
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

    .locked-heading {
        margin: 0.5rem 0;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(255, 255, 255, 0.5);
    }
</style>
