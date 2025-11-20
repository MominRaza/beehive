<script lang="ts">
    export let message: string | null = null;
</script>

{#if message}
    <div class="notification-container">
        <div class="notification">
            {message}
        </div>
    </div>
{/if}

<style>
    .notification-container {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        pointer-events: none;
    }

    .notification {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation:
            slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
            fadeOut 0.5s ease 1.5s forwards;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
</style>
