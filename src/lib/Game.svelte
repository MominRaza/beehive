<script lang="ts">
  import GameCanvas from "./components/GameCanvas.svelte";
  import GameHud from "./components/GameHud.svelte";
  import BottomBar from "./components/BottomBar.svelte";
  import Settings from "./components/Settings.svelte";
</script>

<div class="game-container">
  <GameCanvas />
  <GameHud />
  <BottomBar />
  <Settings />
</div>

<style>
  .game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
