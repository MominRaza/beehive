<script lang="ts">
    interface Props {
        isOpen: boolean;
        title: string;
        message: string;
        type?: "info" | "confirm" | "error" | "success";
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }

    let {
        isOpen = $bindable(false),
        title,
        message,
        type = "info",
        confirmText = "OK",
        cancelText = "Cancel",
        onConfirm,
        onCancel,
    }: Props = $props();

    function handleConfirm() {
        if (onConfirm) onConfirm();
        isOpen = false;
    }

    function handleCancel() {
        if (onCancel) onCancel();
        isOpen = false;
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            handleCancel();
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            handleCancel();
        }
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="dialog-backdrop" onclick={handleBackdropClick}>
        <div
            class="dialog-container"
            class:error={type === "error"}
            class:success={type === "success"}
        >
            <div class="dialog-header">
                <h3>{title}</h3>
            </div>
            <div class="dialog-content">
                <p>{message}</p>
            </div>
            <div class="dialog-actions">
                {#if type === "confirm"}
                    <button class="btn btn-secondary" onclick={handleCancel}>
                        {cancelText}
                    </button>
                    <button class="btn btn-primary" onclick={handleConfirm}>
                        {confirmText}
                    </button>
                {:else}
                    <button class="btn btn-primary" onclick={handleConfirm}>
                        {confirmText}
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .dialog-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .dialog-container {
        background: #1f2937;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        min-width: 400px;
        max-width: 500px;
        animation: slideIn 0.2s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.1);
    }

    @keyframes slideIn {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .dialog-container.error {
        border-color: #ef4444;
    }

    .dialog-container.success {
        border-color: #10b981;
    }

    .dialog-header {
        padding: 1.5rem 1.5rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dialog-header h3 {
        margin: 0;
        color: white;
        font-size: 1.25rem;
        font-weight: 600;
    }

    .dialog-content {
        padding: 1.5rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
    }

    .dialog-content p {
        margin: 0;
    }

    .dialog-actions {
        padding: 1rem 1.5rem 1.5rem;
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }

    .btn {
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-primary {
        background: #3b82f6;
        color: white;
    }

    .btn-primary:hover {
        background: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .error .btn-primary {
        background: #ef4444;
    }

    .error .btn-primary:hover {
        background: #dc2626;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .success .btn-primary {
        background: #10b981;
    }

    .success .btn-primary:hover {
        background: #059669;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
</style>
