<script lang="ts">
    import {
        gameState,
        selectSeed,
        selectTool,
        TOOL_DEFINITIONS,
    } from "../stores/farm";
    import { formatInventorySeeds, getToolIcon } from "./bottomBarHelpers";

    function handleSelectTool(toolId: string) {
        selectTool(toolId);
    }

    function handleSelectSeed(seedId: string) {
        if ($gameState.selectedSeed === seedId) {
            selectSeed(null);
        } else {
            selectSeed(seedId);
        }
    }

    // Get owned tools
    const ownedTools = $derived(
        TOOL_DEFINITIONS.filter((tool) =>
            $gameState.ownedTools.includes(tool.id),
        ),
    );

    // Get seeds from inventory
    const inventorySeeds = $derived(
        formatInventorySeeds($gameState.inventory.seeds),
    );
</script>

<div class="bottom-bar">
    <!-- Center: Quick slots -->
    <div class="quick-slots">
        <!-- Tools -->
        {#each ownedTools.filter((t) => t.id !== "axe" || $gameState.level >= 3) as tool}
            <button
                class="slot"
                class:selected={$gameState.selectedTool === tool.id}
                onclick={() => handleSelectTool(tool.id)}
                title={tool.name}
            >
                {getToolIcon(tool.id)}
            </button>
        {/each}

        <div class="divider"></div>

        <!-- Seeds from inventory -->
        {#each inventorySeeds as seed}
            <button
                class="slot seed-slot"
                class:selected={$gameState.selectedSeed === seed.id}
                onclick={() => handleSelectSeed(seed.id)}
                title={seed.name}
            >
                <span class="slot-icon">{seed.icon}</span>
                <span class="slot-count">{seed.count}</span>
            </button>
        {/each}

        {#if inventorySeeds.length === 0}
            <div class="empty-slot">
                <span>No seeds</span>
            </div>
        {/if}
    </div>
</div>

<style>
    .bottom-bar {
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 2rem;
        align-items: center;
        padding: 0.75rem 1.5rem;
        background: rgba(0, 0, 0, 0.85);
        border-radius: 1rem;
        pointer-events: auto;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }

    .quick-slots {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .slot {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
    }

    .slot:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
    }

    .slot.selected {
        background: rgba(74, 222, 128, 0.3);
        border-color: #4ade80;
        box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
    }

    .seed-slot {
        flex-direction: column;
        padding: 0.25rem;
    }

    .slot-icon {
        font-size: 1.2rem;
    }

    .slot-count {
        font-size: 0.75rem;
        color: white;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.6);
        padding: 0.1rem 0.3rem;
        border-radius: 0.25rem;
        position: absolute;
        bottom: 2px;
        right: 2px;
    }

    .divider {
        width: 2px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        margin: 0 0.5rem;
    }

    .empty-slot {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.85rem;
        padding: 0 1rem;
    }
</style>
