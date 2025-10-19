<script lang="ts">
    import { gameState, xpProgress } from "../../stores/farm";

    $: coinsDisplay = $gameState.coins.toLocaleString();
    $: woodDisplay = $gameState.inventory.wood.toLocaleString();
    $: xpPercent = Math.round($xpProgress.progress * 100);
    $: xpCurrent = Math.round($xpProgress.current);
    $: xpNeeded = Math.round($xpProgress.needed);
</script>

<div class="panel stats-panel">
    <div class="stat-row">
        <span class="icon">💰</span>
        <div class="stat-text">
            <span class="label">Coins</span>
            <span class="value">{coinsDisplay}</span>
        </div>
    </div>

    <div class="stat-row">
        <span class="icon">🪵</span>
        <div class="stat-text">
            <span class="label">Wood</span>
            <span class="value">{woodDisplay}</span>
        </div>
    </div>

    <div class="xp-section">
        <div class="level-line">
            <span class="label">Level</span>
            <span class="value">{$gameState.level}</span>
        </div>
        <div class="xp-bar">
            <div class="xp-fill" style={`width: ${xpPercent}%`}></div>
        </div>
        <div class="xp-text">
            XP {xpCurrent} / {xpNeeded}
        </div>
    </div>
</div>

<style>
    .panel {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 0.75rem;
        color: white;
        min-width: 200px;
        pointer-events: auto;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .stat-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .icon {
        font-size: 1.5rem;
    }

    .stat-text {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
    }

    .label {
        font-size: 0.75rem;
        opacity: 0.75;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .value {
        font-weight: 600;
        font-size: 1.1rem;
    }

    .xp-section {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .level-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .xp-bar {
        width: 100%;
        height: 10px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 999px;
        overflow: hidden;
    }

    .xp-fill {
        height: 100%;
        background: linear-gradient(90deg, #34d399, #22d3ee);
        transition: width 0.2s ease;
    }

    .xp-text {
        font-size: 0.75rem;
        letter-spacing: 0.02em;
        opacity: 0.85;
    }
</style>
