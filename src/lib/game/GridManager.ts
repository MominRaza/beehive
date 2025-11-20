import * as THREE from 'three';
import type { TileType } from './types';

export class GridManager {
    private scene: THREE.Scene;
    public tiles = new Map<string, { mesh: THREE.Mesh; type: TileType; isWatered?: boolean }>();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    createTile(x: number, z: number, type: TileType) {
        const key = `${x},${z}`;

        // Remove existing tile if any
        if (this.tiles.has(key)) {
            const existingData = this.tiles.get(key)!;
            this.scene.remove(existingData.mesh);
            existingData.mesh.geometry.dispose();
            (existingData.mesh.material as THREE.Material).dispose();
            this.tiles.delete(key);
        }

        let height = 0.1;
        let color = 0x8b4513; // Default dirt
        if (type === "grass") {
            color = 0x228b22; // Forest Green
            height = 0.3;
        } else if (type === "path") {
            color = 0x808080; // Grey
            height = 0.4;
        }

        const geometry = new THREE.BoxGeometry(1, height, 1);
        const material = new THREE.MeshStandardMaterial({ color });
        const tile = new THREE.Mesh(geometry, material);
        tile.position.set(x, height / 2, z);
        this.scene.add(tile);
        this.tiles.set(key, { mesh: tile, type });
    }

    waterTile(x: number, z: number) {
        const key = `${x},${z}`;
        const tileData = this.tiles.get(key);

        if (!tileData || tileData.type !== "dirt") return;

        if (!tileData.isWatered) {
            tileData.isWatered = true;
            const material = tileData.mesh.material as THREE.MeshStandardMaterial;
            material.color.setHex(0x5c2e0e); // Darker brown for wet dirt
        }
    }

    getTileType(x: number, z: number): TileType | undefined {
        const key = `${x},${z}`;
        return this.tiles.get(key)?.type;
    }

    dispose() {
        this.tiles.forEach((data) => {
            this.scene.remove(data.mesh);
            data.mesh.geometry.dispose();
            (data.mesh.material as THREE.Material).dispose();
        });
        this.tiles.clear();
    }
}
