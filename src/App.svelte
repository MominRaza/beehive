<script lang="ts">
  import MenuScreen from "./lib/components/MenuScreen.svelte";

  let GameComponent: any = null;
  let showMenu = true;
  let isLoading = false;

  async function handleStartGame() {
    isLoading = true;
    try {
      // Dynamic import to code-split the Game component
      const module = await import("./lib/Game.svelte");
      GameComponent = module.default;
      showMenu = false;
    } catch (error) {
      console.error("Failed to load game:", error);
    } finally {
      isLoading = false;
    }
  }
</script>

{#if showMenu}
  <MenuScreen on:startGame={handleStartGame} />
{:else if isLoading}
  <div class="loading-screen">
    <div class="spinner"></div>
    <p>Loading game...</p>
  </div>
{:else if GameComponent}
  <svelte:component this={GameComponent} />
{/if}

<style>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
