<script lang="ts">
  import MainMenu from "./lib/MainMenu.svelte";
  import GameScene from "./lib/GameScene.svelte";
  import TestScene from "./lib/TestScene.svelte";

  let currentScene = $state(localStorage.getItem("currentScene") || "menu");

  $effect(() => {
    localStorage.setItem("currentScene", currentScene);
  });
</script>

{#if currentScene === "menu"}
  <MainMenu
    onStart={() => (currentScene = "game")}
    onTest={() => (currentScene = "test")}
  />
{:else if currentScene === "game"}
  <GameScene onBack={() => (currentScene = "menu")} />
{:else if currentScene === "test"}
  <TestScene onBack={() => (currentScene = "menu")} />
{/if}
