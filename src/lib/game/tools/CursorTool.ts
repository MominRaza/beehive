import * as THREE from 'three';
import { Tool, type ToolResult, type HoverState } from './Tool';

const CHUNK_SIZE = 12;
const CHUNK_PRICE = 100;

export class CursorTool extends Tool {
    constructor(gameManager: any) {
        super(gameManager);
    }

    private isSignObject(object?: THREE.Object3D): boolean {
        if (!object) return false;
        let obj: THREE.Object3D | null = object;
        while (obj) {
            if (obj.userData && obj.userData.isSign) {
                return true;
            }
            obj = obj.parent;
        }
        return false;
    }

    use(x: number, z: number, intersectedObject?: THREE.Object3D): ToolResult {
        if (!this.isSignObject(intersectedObject)) return { success: false };

        const { cx, cz } = this.gameManager.getChunkCoords(x, z);
        const chunkCenterX = cx * CHUNK_SIZE;
        const chunkCenterZ = cz * CHUNK_SIZE;

        if (Math.abs(x - chunkCenterX) < 1.5 && Math.abs(z - chunkCenterZ) < 1.5) {
            if (!this.gameManager.unlockedChunks.has(`${cx},${cz}`)) {
                if (!this.gameManager.isValidChunk(cx, cz)) return { success: false };

                const isAdjacent =
                    this.gameManager.unlockedChunks.has(`${cx + 1},${cz}`) ||
                    this.gameManager.unlockedChunks.has(`${cx - 1},${cz}`) ||
                    this.gameManager.unlockedChunks.has(`${cx},${cz + 1}`) ||
                    this.gameManager.unlockedChunks.has(`${cx},${cz - 1}`);

                if (isAdjacent) {
                    return {
                        success: false,
                        message: "Buy Land?",
                        data: { type: "buy_land", cx, cz, price: CHUNK_PRICE }
                    };
                }
            }
        }
        return { success: false };
    }

    getHoverState(x: number, z: number, intersectedObject?: THREE.Object3D): HoverState {
        if (!this.isSignObject(intersectedObject)) return { visible: false };

        const { cx, cz } = this.gameManager.getChunkCoords(x, z);
        const chunkCenterX = cx * CHUNK_SIZE;
        const chunkCenterZ = cz * CHUNK_SIZE;

        if (!this.gameManager.unlockedChunks.has(`${cx},${cz}`)) {
            if (!this.gameManager.isValidChunk(cx, cz)) return { visible: false };

            const isAdjacent =
                this.gameManager.unlockedChunks.has(`${cx + 1},${cz}`) ||
                this.gameManager.unlockedChunks.has(`${cx - 1},${cz}`) ||
                this.gameManager.unlockedChunks.has(`${cx},${cz + 1}`) ||
                this.gameManager.unlockedChunks.has(`${cx},${cz - 1}`);

            if (isAdjacent) {
                const scale = new THREE.Vector3(1.1, 2.0, 0.7);
                const rotation = new THREE.Euler(Math.PI / 2, 0, 0);
                return {
                    visible: true,
                    color: 0xffff00,
                    scale,
                    posY: 1,
                    rotation,
                    x: chunkCenterX,
                    z: chunkCenterZ + 0.06
                };
            }
        }
        return { visible: false };
    }
}
