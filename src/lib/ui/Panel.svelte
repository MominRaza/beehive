<script lang="ts">
    export let title: string | null = null;
    export let className: string = "";
</script>

<div class="panel {className}">
    {#if title}
        <div class="panel-header">
            <h3>{title}</h3>
            <slot name="header-actions" />
        </div>
    {/if}
    <div class="panel-content">
        <slot />
    </div>
</div>

<style>
    .panel {
        background-color: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: var(--glass-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--glass-shadow);
        color: var(--color-text);
        overflow: hidden;
        transition: transform 0.2s ease;
    }

    .panel-header {
        padding: 12px 16px;
        background-color: rgba(0, 0, 0, 0.2);
        border-bottom: var(--glass-border-faint);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .panel-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .panel-content {
        padding: 16px;
    }
</style>
