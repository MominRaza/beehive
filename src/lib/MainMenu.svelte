<script lang="ts">
    let { onStart, onTest } = $props<{
        onStart: () => void;
        onTest: () => void;
    }>();
</script>

<div class="menu-container">
    <div class="content">
        <h1>BEEHIVE</h1>
        <div class="buttons">
            <button onclick={onStart}>Start Game</button>
            <button onclick={onTest} class="secondary">Test Scene</button>
        </div>
    </div>
</div>

<style>
    .menu-container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        color: white;
        font-family: sans-serif;
    }

    .content {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    h1 {
        font-size: 5rem;
        margin: 0;
        letter-spacing: 0.5rem;
        background: linear-gradient(to right, #ffaa00, #ffdd00);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 20px rgba(255, 170, 0, 0.3);
    }

    .buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 300px;
        margin: 0 auto;
    }

    button {
        padding: 1rem 2rem;
        font-size: 1.2rem;
        background: #ffaa00;
        border: none;
        border-radius: 8px;
        color: #000;
        font-weight: bold;
        cursor: pointer;
        transition:
            transform 0.1s,
            filter 0.1s;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    button:hover {
        transform: scale(1.02);
        filter: brightness(1.1);
    }

    button:active {
        transform: scale(0.98);
    }

    button.secondary {
        background: transparent;
        border: 2px solid #333;
        color: #888;
    }

    button.secondary:hover {
        border-color: #666;
        color: #fff;
    }
</style>
