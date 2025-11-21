<script lang="ts">
    import GameButton from "./GameButton.svelte";
    import Panel from "./Panel.svelte";
    import { inventory } from "../stores";

    export let selectedTool: string;
    export let onSelectTool: (tool: string) => void;

    const tools = [
        { id: "dirt", label: "Dirt", icon: "🟫", group: "terraform" },
        { id: "grass", label: "Grass", icon: "🟩", group: "terraform" },
        { id: "path", label: "Path", icon: "⬜", group: "terraform" },

        {
            id: "wheat",
            label: "Wheat",
            icon: "🌾",
            group: "seeds",
            item: "wheat_seed",
        },
        {
            id: "carrot",
            label: "Carrot",
            icon: "🥕",
            group: "seeds",
            item: "carrot_seed",
        },
        {
            id: "tomato",
            label: "Tomato",
            icon: "🍅",
            group: "seeds",
            item: "tomato_seed",
        },
        {
            id: "oak",
            label: "Oak",
            icon: "🌳",
            group: "seeds",
            item: "oak_sapling",
        },
        {
            id: "pine",
            label: "Pine",
            icon: "🌲",
            group: "seeds",
            item: "pine_sapling",
        },

        { id: "water", label: "Water", icon: "💧", group: "basic" },
        { id: "harvest", label: "Harvest", icon: "🧺", group: "basic" },
        { id: "axe", label: "Axe", icon: "🪓", group: "basic" },
    ];
</script>

<div class="toolbar-container">
    <Panel className="toolbar-panel">
        <div class="toolbar-scroll">
            <div class="tool-group">
                {#each tools.filter((t) => t.group === "terraform") as tool}
                    <div class="tool-wrapper" title={tool.label}>
                        <GameButton
                            variant="secondary"
                            active={selectedTool === tool.id}
                            onClick={() => onSelectTool(tool.id)}
                            className="icon-only"
                        >
                            {tool.icon}
                        </GameButton>
                    </div>
                {/each}
            </div>

            <div class="separator"></div>

            <div class="tool-group">
                {#each tools.filter((t) => t.group === "seeds") as tool}
                    {#if ($inventory[tool.item || ""] || 0) > 0}
                        <div
                            class="tool-wrapper"
                            title="{tool.label} ({$inventory[tool.item || ''] ||
                                0})"
                        >
                            <GameButton
                                variant="secondary"
                                active={selectedTool === tool.id}
                                onClick={() => onSelectTool(tool.id)}
                                className="icon-only"
                            >
                                <div class="btn-content">
                                    <span>{tool.icon}</span>
                                    <span class="badge"
                                        >{$inventory[tool.item || ""] ||
                                            0}</span
                                    >
                                </div>
                            </GameButton>
                        </div>
                    {/if}
                {/each}
            </div>

            <div class="separator"></div>

            <div class="tool-group">
                {#each tools.filter((t) => t.group === "basic") as tool}
                    <div class="tool-wrapper" title={tool.label}>
                        <GameButton
                            variant="secondary"
                            active={selectedTool === tool.id}
                            onClick={() => onSelectTool(tool.id)}
                            className="icon-only"
                        >
                            {tool.icon}
                        </GameButton>
                    </div>
                {/each}
            </div>
        </div>
    </Panel>
</div>

<style>
    .toolbar-container {
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        width: auto;
        max-width: 90%;
    }

    .toolbar-scroll {
        display: flex;
        align-items: center;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 4px;
        justify-content: center;
    }

    .tool-group {
        display: flex;
        gap: 8px;
    }

    .separator {
        width: 1px;
        height: 32px;
        background: var(--divider-color);
        flex-shrink: 0;
    }

    .btn-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1;
        gap: 2px;
    }

    .badge {
        font-size: 0.7rem;
        opacity: 0.8;
        font-family: monospace;
        position: absolute;
        bottom: 2px;
        right: 2px;
        background: var(--overlay-bg);
        padding: 0 2px;
        border-radius: 4px;
    }

    :global(.icon-only) {
        width: 48px;
        height: 48px;
        padding: 0 !important;
        font-size: 1.5rem !important;
    }

    /* Hide scrollbar for cleaner look but keep functionality */
    .toolbar-scroll::-webkit-scrollbar {
        height: 4px;
    }
    .toolbar-scroll::-webkit-scrollbar-thumb {
        background: var(--glass-bg-hover);
        border-radius: 2px;
    }
</style>
