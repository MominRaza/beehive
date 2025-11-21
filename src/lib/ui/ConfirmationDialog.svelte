<script lang="ts">
    import Panel from "./Panel.svelte";
    import GameButton from "./GameButton.svelte";

    export let title: string;
    export let message: string;
    export let onConfirm: () => void;
    export let onCancel: () => void;
</script>

<div class="overlay">
    <Panel title={title} onClose={onCancel}>
        <div class="content">
            <p>{message}</p>
            <div class="actions">
                <GameButton variant="secondary" onClick={onCancel}>Cancel</GameButton>
                <GameButton variant="primary" onClick={onConfirm}>Confirm</GameButton>
            </div>
        </div>
    </Panel>
</div>

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }
    .content {
        padding: 20px;
        text-align: center;
        color: #5c4033;
        font-size: 1.1rem;
    }
    .actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
    }
</style>
