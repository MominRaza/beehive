<script lang="ts">
    import { gameState } from "../../stores/farm";

    const icons: Record<string, string> = {
        wheat: "🌾",
        carrot: "🥕",
        potato: "🥔",
        tomato: "🍅",
        corn: "🌽",
        pumpkin: "🎃",
        apple: "🍎",
        orange: "🍊",
    };

    $: foodEntries = Object.entries($gameState.inventory.food)
        .map(([id, amount]) => ({
            id,
            amount,
            icon: icons[id] || "🍽️",
        }))
        .sort((a, b) => b.amount - a.amount);

    $: totalItems = foodEntries.reduce((sum, entry) => sum + entry.amount, 0);
</script>

<div class="panel inventory-panel">
    <header>Food Storage</header>
    <p class="summary">Total items: {totalItems}</p>

    {#if foodEntries.length === 0}
        <p class="empty">No harvest stored</p>
    {:else}
        <ul>
            {#each foodEntries as entry}
                <li>
                    <span class="icon">{entry.icon}</span>
                    <span class="name">{entry.id}</span>
                    <span class="amount">{entry.amount}</span>
                </li>
            {/each}
        </ul>
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

    .summary {
        font-size: 0.8rem;
        opacity: 0.75;
    }

    .empty {
        font-size: 0.85rem;
        opacity: 0.7;
    }

    ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-height: 200px;
        overflow-y: auto;
        padding-right: 0.3rem;
    }

    li {
        display: grid;
        grid-template-columns: 32px 1fr auto;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem 0.55rem;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 0.5rem;
    }

    .icon {
        font-size: 1.4rem;
    }

    .name {
        text-transform: capitalize;
    }

    .amount {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }
</style>
