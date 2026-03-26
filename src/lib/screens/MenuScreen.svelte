<script lang="ts">
  import Button from '../components/Button.svelte';

  interface Props {
    onPlay: () => void;
  }

  let { onPlay }: Props = $props();
</script>

<div class="menu">
  <h1>BEEHIVE</h1>

  <nav>
    <Button variant="primary" onclick={onPlay}>Play</Button>
    <Button variant="secondary">Settings</Button>
    <Button variant="secondary">About</Button>
  </nav>
</div>

<style>
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    height: 100vh;
    background: var(--bg);
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: 0.3em;
    color: var(--text);
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 180px;
  }
</style>
