<script lang="ts">
  import MenuScreen from './lib/screens/MenuScreen.svelte';
  import GameScreen from './lib/screens/GameScreen.svelte';

  type Screen = 'menu' | 'game';
  let screen = $state<Screen>('menu');
</script>

{#if screen === 'menu'}
  <MenuScreen onPlay={() => (screen = 'game')} />
{:else if screen === 'game'}
  <GameScreen onMenu={() => (screen = 'menu')} />
{/if}

