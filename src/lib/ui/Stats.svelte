<script lang="ts">
    export let inventory: Record<string, number> = {};
    export let produceCount: number = 0;
    export let maxCapacity: number = 20;
</script>

<div class="stats-container">
    <div class="stat-box">
        <span class="icon">🪙</span>
        <span class="value coin-value">{inventory["coins"] || 0}</span>
    </div>
    <div class="stat-box">
        <span class="icon">📦</span>
        <span class="value {produceCount >= maxCapacity ? 'danger' : ''}">
            {produceCount} / {maxCapacity}
        </span>
    </div>
</div>

<style>
    .stats-container {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .stat-box {
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        padding: 8px 16px;
        border-radius: var(--radius-md);
        border: var(--glass-border);
        box-shadow: var(--glass-shadow);
        min-width: 120px;
    }

    .icon {
        font-size: 2rem;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .value {
        font-weight: 700;
        font-family: monospace;
        font-size: 1.5rem;
        color: var(--color-text);
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .coin-value {
        color: var(--color-accent);
    }

    .danger {
        color: var(--color-danger);
    }
</style>
