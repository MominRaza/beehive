<script lang="ts">
  interface Props {
    onMenu: () => void;
  }

  let { onMenu }: Props = $props();
</script>

<div class="game">
  <!-- game canvas / content goes here -->
</div>

<style>
  .game {
    width: 100vw;
    height: 100vh;
    background: #0d0d0d;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
