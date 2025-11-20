<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let selectedTool:
        | "none"
        | "dirt"
        | "grass"
        | "path"
        | "water"
        | "wheat"
        | "carrot"
        | "tomato";
</script>

<div class="top-hud">
    <button on:click={() => dispatch("save")}>Save</button>
    <button on:click={() => dispatch("delete")}>Delete</button>
</div>

<div class="hud">
    <div class="toolbar">
        <button
            class:active={selectedTool === "none"}
            on:click={() => (selectedTool = "none")}
        >
            None
        </button>
        <button
            class:active={selectedTool === "dirt"}
            on:click={() => (selectedTool = "dirt")}
        >
            Dirt
        </button>
        <button
            class:active={selectedTool === "grass"}
            on:click={() => (selectedTool = "grass")}
        >
            Grass
        </button>
        <button
            class:active={selectedTool === "path"}
            on:click={() => (selectedTool = "path")}
        >
            Path
        </button>
        <button
            class:active={selectedTool === "wheat"}
            on:click={() => (selectedTool = "wheat")}
        >
            Wheat
        </button>
        <button
            class:active={selectedTool === "carrot"}
            on:click={() => (selectedTool = "carrot")}
        >
            Carrot
        </button>
        <button
            class:active={selectedTool === "tomato"}
            on:click={() => (selectedTool = "tomato")}
        >
            Tomato
        </button>
        <button
            class:active={selectedTool === "water"}
            on:click={() => (selectedTool = "water")}
        >
            Water
        </button>
    </div>
</div>

<style>
    .top-hud {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 10;
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 8px;
    }

    .hud {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
    }

    .toolbar {
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 8px;
    }

    button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #444;
        color: white;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    }

    button:hover {
        background: #555;
    }

    button.active {
        background: #646cff;
        color: white;
    }
</style>
