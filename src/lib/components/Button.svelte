<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'icon';
    onclick?: () => void;
    children: Snippet;
  }

  let { variant = 'secondary', onclick, children }: Props = $props();
</script>

<button class={variant} {onclick}>
  {@render children()}
</button>

<style>
  button {
    border-radius: var(--radius);
    font-size: 1rem;
    cursor: pointer;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s,
      transform 0.1s;
  }

  button:hover {
    transform: translateY(-1px);
  }

  button:active {
    transform: translateY(0);
  }

  .primary {
    padding: 0.85rem 0;
    width: 100%;
    background: var(--accent);
    color: var(--bg);
    border: none;
    font-weight: 700;
  }

  .primary:hover {
    background: var(--accent-hover);
  }

  .secondary {
    padding: 0.85rem 0;
    width: 100%;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    font-weight: 600;
  }

  .secondary:hover {
    color: var(--text);
    border-color: var(--border-hover);
  }

  .icon {
    width: 2.2rem;
    height: 2.2rem;
    padding: 0;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    font-size: 0.9rem;
    letter-spacing: 0;
    text-transform: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon:hover {
    color: var(--text);
    border-color: var(--border-hover);
  }
</style>
