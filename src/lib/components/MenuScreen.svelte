<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { hasSavedGame } from "../systems/storage";

    const dispatch = createEventDispatcher();

    let savedGameExists = false;

    onMount(() => {
        savedGameExists = hasSavedGame();
    });

    function handleContinueGame() {
        dispatch("continueGame");
    }

    function handleNewGame() {
        dispatch("newGame");
    }
</script>

<div class="menu-container">
    <div class="menu-content">
        <h1 class="game-title">🐝 Beehive Farm</h1>
        <div class="menu-buttons">
            {#if savedGameExists}
                <button
                    class="menu-button primary"
                    on:click={handleContinueGame}
                >
                    Continue Game
                </button>
                <button class="menu-button" on:click={handleNewGame}>
                    New Game
                </button>
            {:else}
                <button class="menu-button primary" on:click={handleNewGame}>
                    Start Game
                </button>
            {/if}
            <button class="menu-button"> How to Play </button>
            <button class="menu-button"> Credits </button>
        </div>
    </div>
</div>

<style>
    .menu-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .menu-content {
        text-align: center;
        animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .game-title {
        font-size: 4rem;
        font-weight: bold;
        color: white;
        margin-bottom: 3rem;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .menu-button {
        padding: 1rem 3rem;
        font-size: 1.25rem;
        font-weight: 600;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.9);
        color: #667eea;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 250px;
    }

    .menu-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    .menu-button:active {
        transform: translateY(0);
    }

    .menu-button.primary {
        background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
        color: white;
        font-size: 1.5rem;
        padding: 1.25rem 3.5rem;
    }

    .menu-button.primary:hover {
        background: linear-gradient(135deg, #ffe5b4 0%, #1e6a9e 100%);
    }

    @media (max-width: 768px) {
        .game-title {
            font-size: 2.5rem;
        }

        .menu-button {
            font-size: 1rem;
            padding: 0.875rem 2rem;
            min-width: 200px;
        }

        .menu-button.primary {
            font-size: 1.25rem;
            padding: 1rem 2.5rem;
        }
    }
</style>
