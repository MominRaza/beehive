import * as THREE from 'three';

export class TileManager {
    private scene: THREE.Scene;
    private tiles = new Map<string, { mesh: THREE.Mesh; type: string; isWatered?: boolean }>();
    private crops = new Map<string, { mesh: THREE.Mesh; type: string }>();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    createTile(x: number, z: number, type: "dirt" | "grass" | "path") {
        const key = `${x},${z}`;

        // Remove existing tile if any
        if (this.tiles.has(key)) {
            const existingData = this.tiles.get(key)!;
            this.scene.remove(existingData.mesh);
            existingData.mesh.geometry.dispose();
            (existingData.mesh.material as THREE.Material).dispose();
            this.tiles.delete(key);
        }

        // Remove existing crop if any (since we are changing the tile)
        if (this.crops.has(key)) {
            const existingCropData = this.crops.get(key)!;
            this.scene.remove(existingCropData.mesh);
            existingCropData.mesh.geometry.dispose();
            (existingCropData.mesh.material as THREE.Material).dispose();
            this.crops.delete(key);
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

    createCrop(x: number, z: number, type: "wheat" | "carrot" | "tomato") {
        const key = `${x},${z}`;
        const tileData = this.tiles.get(key);

        // Can only place on dirt
        if (!tileData || tileData.type !== "dirt") return;

        // Check if crop already exists
        if (this.crops.has(key)) {
            return;
        }

        let color = 0xffff00; // Wheat
        if (type === "carrot") color = 0xffa500; // Orange
        if (type === "tomato") color = 0xff6347; // Tomato

        const geometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
        const material = new THREE.MeshStandardMaterial({ color });
        const crop = new THREE.Mesh(geometry, material);

        // Dirt height is 0.1, so place crop on top
        // Crop height is 0.5, so center is at 0.1 + 0.25 = 0.35
        crop.position.set(x, 0.35, z);

        this.scene.add(crop);
        this.crops.set(key, { mesh: crop, type });
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

    getTileType(x: number, z: number): string | undefined {
        const key = `${x},${z}`;
        return this.tiles.get(key)?.type;
    }

    serialize() {
        const tilesData = Array.from(this.tiles.entries()).map(([key, data]) => ({
            key,
            type: data.type,
            isWatered: data.isWatered
        }));
        const cropsData = Array.from(this.crops.entries()).map(([key, data]) => ({
            key,
            type: data.type
        }));
        return { tiles: tilesData, crops: cropsData };
    }

    load(data: { tiles: any[], crops: any[] }) {
        this.dispose(); // Clear current state

        data.tiles.forEach(tileData => {
            const [x, z] = tileData.key.split(',').map(Number);
            this.createTile(x, z, tileData.type);
            if (tileData.isWatered) {
                this.waterTile(x, z);
            }
        });

        data.crops.forEach(cropData => {
            const [x, z] = cropData.key.split(',').map(Number);
            this.createCrop(x, z, cropData.type);
        });
    }

    dispose() {
        this.tiles.forEach((data) => {
            this.scene.remove(data.mesh);
            data.mesh.geometry.dispose();
            (data.mesh.material as THREE.Material).dispose();
        });
        this.tiles.clear();

        this.crops.forEach((data) => {
            this.scene.remove(data.mesh);
            data.mesh.geometry.dispose();
            (data.mesh.material as THREE.Material).dispose();
        });
        this.crops.clear();
    }
}
