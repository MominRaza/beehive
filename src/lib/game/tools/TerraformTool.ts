import * as THREE from 'three';
import { Tool, type ToolResult, type HoverState } from './Tool';
import type { TileType } from '../types';

export class TerraformTool extends Tool {
    private tileType: TileType;

    constructor(gameManager: any, tileType: TileType) {
        super(gameManager);
        this.tileType = tileType;
    }

    use(x: number, z: number): ToolResult {
        if (!this.gameManager.isTileUnlocked(x, z)) {
            return { success: false, message: "Area Locked" };
        }

        // Prevent interaction near the hut (0,0)
        if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) return { success: false };

        // Check if tile is occupied
        const key = `${x},${z}`;
        if (this.gameManager.cropManager.crops.has(key) || this.gameManager.treeManager.trees.has(key)) {
            return { success: false, message: "Tile is occupied!" };
        }

        this.gameManager.gridManager.createTile(x, z, this.tileType);
        return { success: true };
    }

    getHoverState(x: number, z: number): HoverState {
        if (!this.gameManager.isTileUnlocked(x, z)) {
            return { visible: true, color: 0x333333, scale: 1, posY: 0.05 };
        }

        if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) return { visible: false };

        let color = 0xffffff;
        let scale = 1;
        let posY = 0.05;

        if (this.tileType === "dirt") {
            color = 0x8b4513;
            scale = 1;
            posY = 0.05;
        } else if (this.tileType === "grass") {
            color = 0x228b22;
            scale = 3;
            posY = 0.15;
        } else if (this.tileType === "path") {
            color = 0x808080;
            scale = 4;
            posY = 0.2;
        }

        return { visible: true, color, scale, posY };
    }
}
