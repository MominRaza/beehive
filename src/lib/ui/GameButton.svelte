<script lang="ts">
    export let variant: "primary" | "secondary" | "danger" | "ghost" =
        "primary";
    export let active: boolean = false;
    export let disabled: boolean = false;
    export let className: string = "";
    export let onClick: (() => void) | undefined = undefined;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
    class="game-btn {variant} {active ? 'active' : ''} {className}"
    {disabled}
    on:click={onClick}
    on:click
>
    <slot />
</button>

<style>
    .game-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.15s ease;
        text-transform: capitalize;
        position: relative;
        overflow: hidden;
    }

    .game-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        filter: grayscale(0.8);
    }

    .game-btn:active:not(:disabled) {
        transform: translateY(1px);
    }

    /* Variants */
    .primary {
        background-color: var(--color-primary);
        color: #0f172a; /* Dark text on bright button */
        box-shadow: 0 4px 0 var(--color-primary-dark);
    }
    .primary:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 5px 0 var(--color-primary-dark);
    }
    .primary:active:not(:disabled) {
        box-shadow: 0 2px 0 var(--color-primary-dark);
        transform: translateY(2px);
    }
    .primary.active {
        background-color: var(--color-accent);
        box-shadow: 0 2px 0 #d97706; /* Darker gold */
        transform: translateY(2px);
    }

    .secondary {
        background-color: var(--glass-bg-light);
        color: var(--color-text);
        border: var(--glass-border);
    }
    .secondary:hover:not(:disabled) {
        background-color: var(--glass-bg-hover);
    }
    .secondary.active {
        background-color: var(--color-primary);
        color: #0f172a;
        border-color: transparent;
    }

    .danger {
        background-color: var(--color-danger);
        color: white;
        box-shadow: 0 4px 0 #b91c1c;
    }
    .danger:hover:not(:disabled) {
        filter: brightness(1.1);
    }
    .danger:active:not(:disabled) {
        box-shadow: 0 2px 0 #b91c1c;
        transform: translateY(2px);
    }

    .ghost {
        background: transparent;
        color: var(--color-text-muted);
        padding: 4px;
    }
    .ghost:hover:not(:disabled) {
        color: var(--color-text);
        background: var(--glass-bg-light);
    }
</style>
