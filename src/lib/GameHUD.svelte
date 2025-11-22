<script lang="ts">
    let { onBack, selectedSeed = $bindable(null) } = $props<{
        onBack: () => void;
        selectedSeed: string | null;
    }>();

    const seeds = [
        { id: "soil", name: "Soil", color: "#8b4513" },
        { id: "grass", name: "Grass", color: "#228b22" },
        { id: "path", name: "Path", color: "#808080" },
        { id: "wheat", name: "Wheat", color: "#ffd700" },
        { id: "carrot", name: "Carrot", color: "#ff8c00" },
        { id: "tomato", name: "Tomato", color: "#ff0000" },
        { id: "harvest", name: "Harvest", color: "#ff69b4" },
    ];
</script>

<div class="hud">
    <button class="back-button" onclick={onBack}>Back to Menu</button>

    <div class="toolbar">
        {#each seeds as seed}
            <button
                class="tool-btn"
                class:selected={selectedSeed === seed.id}
                onclick={() => (selectedSeed = seed.id)}
                title={seed.name}
            >
                <div
                    class="seed-icon"
                    style="background-color: {seed.color}"
                ></div>
                <span class="seed-name">{seed.name}</span>
            </button>
        {/each}
    </div>
</div>

<style>
    .hud {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .back-button {
        position: absolute;
        top: 20px;
        left: 20px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: white;
        cursor: pointer;
        border-radius: 4px;
        backdrop-filter: blur(4px);
        transition: all 0.2s;
        font-family: sans-serif;
        pointer-events: auto;
    }

    .back-button:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .toolbar {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 8px;
        backdrop-filter: blur(4px);
        pointer-events: auto;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .tool-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        padding: 8px;
        width: 60px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tool-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .tool-btn.selected {
        background: rgba(255, 255, 255, 0.3);
        border-color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .seed-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .seed-name {
        color: white;
        font-size: 10px;
        font-family: sans-serif;
    }
</style>
