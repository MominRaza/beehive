import * as THREE from 'three';
import { Tool, type ToolResult, type HoverState } from './Tool';
import type { CropType, TreeType, InventoryItemType } from '../types';

export class PlantTool extends Tool {
    private type: CropType | TreeType;
    private isTree: boolean;

    constructor(gameManager: any, type: CropType | TreeType, isTree: boolean) {
        super(gameManager);
        this.type = type;
        this.isTree = isTree;
    }

    use(x: number, z: number): ToolResult {
        if (!this.gameManager.isTileUnlocked(x, z)) {
            return { success: false, message: "Area Locked" };
        }

        if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) return { success: false };

        const tileType = this.gameManager.gridManager.getTileType(x, z);

        if (this.isTree) {
            if (tileType === "grass") {
                const saplingType = `${this.type}_sapling` as InventoryItemType;
                if (this.gameManager.inventoryManager.removeItem(saplingType, 1)) {
                    this.gameManager.treeManager.createTree(x, z, this.type as TreeType);
                    return { success: true };
                } else {
                    return { success: false, message: "Not enough saplings!" };
                }
            }
        } else {
            if (tileType === "dirt") {
                const seedType = `${this.type}_seed` as InventoryItemType;
                if (this.gameManager.inventoryManager.removeItem(seedType, 1)) {
                    this.gameManager.cropManager.createCrop(x, z, this.type as CropType);
                    return { success: true };
                } else {
                    return { success: false, message: "Not enough seeds!" };
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

        if (this.isTree) {
            if (tileType === "grass") {
                const color = this.type === "oak" ? 0x228b22 : 0x2e8b57;
                return { visible: true, color, scale: 0.5, posY: 0.35 };
            }
        } else {
            if (tileType === "dirt") {
                let color = 0xffff00; // Wheat
                if (this.type === "carrot") color = 0xffa500;
                if (this.type === "tomato") color = 0xff6347;
                return { visible: true, color, scale: 0.5, posY: 0.35 };
            }
        }

        return { visible: false };
    }
}
