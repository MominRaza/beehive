<script lang="ts">
    import { gameState } from "../stores/farm";
    import { saveGameState, clearGameState } from "../systems/storage";
    import Dialog from "./Dialog.svelte";
    import Snackbar from "./Snackbar.svelte";

    let dialogOpen = $state(false);
    let dialogTitle = $state("");
    let dialogMessage = $state("");
    let dialogType = $state<"info" | "confirm" | "error" | "success">("info");
    let dialogConfirmText = $state("OK");
    let dialogCancelText = $state("Cancel");
    let dialogOnConfirm = $state<(() => void) | undefined>(undefined);

    let snackbarVisible = $state(false);
    let snackbarMessage = $state("");
    let snackbarType = $state<"info" | "success" | "error">("info");

    function showDialog(
        title: string,
        message: string,
        type: "info" | "confirm" | "error" | "success" = "info",
        confirmText: string = "OK",
        cancelText: string = "Cancel",
        onConfirm?: () => void,
    ) {
        dialogTitle = title;
        dialogMessage = message;
        dialogType = type;
        dialogConfirmText = confirmText;
        dialogCancelText = cancelText;
        dialogOnConfirm = onConfirm;
        dialogOpen = true;
    }

    function showSnackbar(
        message: string,
        type: "info" | "success" | "error" = "info",
    ) {
        snackbarMessage = message;
        snackbarType = type;
        snackbarVisible = true;
    }

    function handleSaveGame() {
        if (saveGameState($gameState)) {
            showSnackbar("Game saved successfully!", "success");
        } else {
            showSnackbar("Failed to save game", "error");
        }
    }

    function handleDeleteSave() {
        showDialog(
            "Delete Saved Game",
            "Are you sure you want to delete your saved game? This action cannot be undone.",
            "confirm",
            "Delete",
            "Cancel",
            () => {
                if (clearGameState()) {
                    showSnackbar(
                        "Saved game deleted. Refresh the page to start a new game.",
                        "success",
                    );
                } else {
                    showSnackbar("Failed to delete saved game", "error");
                }
            },
        );
    }
</script>

<button class="save-button" onclick={handleSaveGame}>💾 Save</button>
<button class="delete-button" onclick={handleDeleteSave}>🗑️ Delete Save</button>

<Dialog
    bind:isOpen={dialogOpen}
    title={dialogTitle}
    message={dialogMessage}
    type={dialogType}
    confirmText={dialogConfirmText}
    cancelText={dialogCancelText}
    onConfirm={dialogOnConfirm}
/>

<Snackbar
    bind:isVisible={snackbarVisible}
    message={snackbarMessage}
    type={snackbarType}
/>

<style>
    .save-button {
        position: fixed;
        top: 1rem;
        right: 1rem;
        padding: 0.6rem 1.2rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        pointer-events: auto;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .save-button:hover {
        background: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
    }

    .delete-button {
        position: fixed;
        top: 1rem;
        right: 9rem;
        padding: 0.6rem 1.2rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        pointer-events: auto;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .delete-button:hover {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
    }
</style>
