<script lang="ts">
    interface Props {
        message: string;
        type?: "info" | "success" | "error";
        duration?: number;
        isVisible: boolean;
    }

    let {
        message,
        type = "info",
        duration = 3000,
        isVisible = $bindable(false),
    }: Props = $props();

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    $effect(() => {
        if (isVisible) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                isVisible = false;
                timeoutId = null;
            }, duration);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        };
    });
</script>

{#if isVisible}
    <div
        class="snackbar"
        class:success={type === "success"}
        class:error={type === "error"}
        class:info={type === "info"}
    >
        <span class="icon">
            {#if type === "success"}
                ✓
            {:else if type === "error"}
                ✕
            {:else}
                ℹ
            {/if}
        </span>
        <span class="message">{message}</span>
    </div>
{/if}

<style>
    .snackbar {
        position: fixed;
        bottom: 5rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.875rem 1.5rem;
        background: rgba(30, 41, 59, 0.95);
        border-radius: 0.75rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: slideUp 0.3s ease-out;
        pointer-events: none;
        min-width: 300px;
        max-width: 500px;
    }

    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    .snackbar.success {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.15);
    }

    .snackbar.error {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.15);
    }

    .snackbar.info {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.15);
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        font-weight: bold;
        font-size: 1rem;
        flex-shrink: 0;
    }

    .success .icon {
        background: #10b981;
        color: white;
    }

    .error .icon {
        background: #ef4444;
        color: white;
    }

    .info .icon {
        background: #3b82f6;
        color: white;
    }

    .message {
        color: white;
        font-size: 0.95rem;
        font-weight: 500;
    }
</style>
