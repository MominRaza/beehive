import * as THREE from 'three';
import { Tool, type ToolResult, type HoverState } from './Tool';
import type { InventoryItemType } from '../types';

export class ActionTool extends Tool {
    private action: "water" | "harvest" | "axe";

    constructor(gameManager: any, action: "water" | "harvest" | "axe") {
        super(gameManager);
        this.action = action;
    }

    use(x: number, z: number): ToolResult {
        if (!this.gameManager.isTileUnlocked(x, z)) {
            return { success: false, message: "Area Locked" };
        }

        if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) return { success: false };

        if (this.action === "water") {
            const tileType = this.gameManager.gridManager.getTileType(x, z);
            if (tileType === "dirt") {
                this.gameManager.gridManager.waterTile(x, z);
                return { success: true };
            }
        } else if (this.action === "harvest") {
            if (this.gameManager.inventoryManager.getProduceCount() >= this.gameManager.inventoryManager.getMaxCapacity()) {
                return { success: false, message: "Inventory Full!" };
            }

            const harvestedCrop = this.gameManager.cropManager.harvest(x, z);
            if (harvestedCrop) {
                const produceType = `${harvestedCrop}_produce` as InventoryItemType;
                if (this.gameManager.inventoryManager.addItem(produceType, 1)) {
                    return { success: true };
                }
            }
        } else if (this.action === "axe") {
            if (this.gameManager.inventoryManager.getProduceCount() + 2 > this.gameManager.inventoryManager.getMaxCapacity()) {
                return { success: false, message: "Inventory Full!" };
            }

            if (this.gameManager.treeManager.harvest(x, z)) {
                if (this.gameManager.inventoryManager.addItem("wood", 2)) {
                    return { success: true };
                }
            }
        }

        return { success: false };
    }

    getHoverState(x: number, z: number): HoverState {
        if (!this.gameManager.isTileUnlocked(x, z)) {
            return { visible: true, color: 0x333333, scale: 1, posY: 0.05 };
        }

        if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) return { visible: false };

        const tileType = this.gameManager.gridManager.getTileType(x, z);

        if (this.action === "water") {
            if (tileType === "dirt") {
                return { visible: true, color: 0x0000ff, scale: 1.1, posY: 0.05 };
            }
        } else if (this.action === "harvest") {
            if (tileType === "dirt") {
                return { visible: true, color: 0x800080, scale: 1.1, posY: 0.05 };
            }
        } else if (this.action === "axe") {
            return { visible: true, color: 0xff0000, scale: 1.1, posY: 0.05 };
        }

        return { visible: false };
    }
}
