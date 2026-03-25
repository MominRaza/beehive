<script lang="ts">
  interface Props {
    onPlay: () => void;
  }

  let { onPlay }: Props = $props();
</script>

<div class="menu">
  <h1>BEEHIVE</h1>

  <nav>
    <button class="btn-primary" onclick={onPlay}>Play</button>
    <button class="btn-secondary">Settings</button>
    <button class="btn-secondary">About</button>
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
    background: #0d0d0d;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: 0.3em;
    color: #ffffff;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 180px;
  }

  .btn-primary {
    padding: 0.85rem 0;
    background: #f5a623;
    color: #0d0d0d;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    text-transform: uppercase;
  }

  .btn-primary:hover {
    background: #ffc04d;
    transform: translateY(-1px);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-secondary {
    padding: 0.85rem 0;
    background: transparent;
    color: #888;
    border: 1px solid #333;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, transform 0.1s;
    text-transform: uppercase;
  }

  .btn-secondary:hover {
    color: #fff;
    border-color: #666;
    transform: translateY(-1px);
  }

  .btn-secondary:active {
    transform: translateY(0);
  }
</style>
