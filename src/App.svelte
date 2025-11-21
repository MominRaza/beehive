<script lang="ts">
  import GameScene from "./lib/GameScene.svelte";
  import TestScene from "./lib/TestScene.svelte";

  let currentView: "game" | "test" = "game";

  function goToTestScene() {
    currentView = "test";
  }

  function goToGameScene() {
    currentView = "game";
  }
</script>

<main>
  {#if currentView === "game"}
    <GameScene on:openTestScene={goToTestScene} />
  {:else}
    <TestScene onBack={goToGameScene} />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
