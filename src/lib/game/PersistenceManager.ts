import { GameManager } from './GameManager';

export class PersistenceManager {
    private static STORAGE_KEY = "beehive_save";

    static saveGame(gameManager: GameManager) {
        const data = gameManager.serialize();
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("Failed to save game", e);
            return false;
        }
    }

    static loadGame(gameManager: GameManager): boolean {
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                gameManager.load(data);
                return true;
            } catch (e) {
                console.error("Failed to load save data", e);
                return false;
            }
        }
        return false;
    }

    static deleteSave() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    static hasSave(): boolean {
        return !!localStorage.getItem(this.STORAGE_KEY);
    }
}
