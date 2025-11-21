<script lang="ts">
    import Panel from "./Panel.svelte";
    import GameButton from "./GameButton.svelte";

    export let onResume: () => void;
    export let onSave: () => void;
    export let onReset: () => void;
    export let onTestScene: () => void;
</script>

<div class="pause-overlay">
    <div class="pause-modal">
        <Panel title="Paused" className="pause-panel">
            <div class="menu-content">
                <GameButton
                    variant="primary"
                    onClick={onResume}
                    className="full-width"
                >
                    ▶️ Continue
                </GameButton>
                <GameButton
                    variant="secondary"
                    onClick={onSave}
                    className="full-width"
                >
                    💾 Save Game
                </GameButton>
                <GameButton
                    variant="secondary"
                    onClick={onTestScene}
                    className="full-width"
                >
                    🧪 Test Scene
                </GameButton>
                <div class="divider"></div>
                <GameButton
                    variant="danger"
                    onClick={onReset}
                    className="full-width"
                >
                    🗑️ Reset Progress
                </GameButton>
            </div>
        </Panel>
    </div>
</div>

<style>
    .pause-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
        animation: fadeIn 0.2s ease;
    }

    .pause-modal {
        width: 300px;
    }

    .menu-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 0;
    }

    .divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 4px 0;
    }

    :global(.full-width) {
        width: 100%;
        justify-content: center;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
