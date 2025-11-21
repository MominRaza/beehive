import * as THREE from 'three';
import { type TileType, TILE_DIMENSIONS, SURFACE_HEIGHTS } from './types';

export class GridManager {
    private scene: THREE.Scene;
    public tiles = new Map<string, { mesh: THREE.Object3D; type: TileType; isWatered?: boolean }>();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    createTile(x: number, z: number, type: TileType) {
        const key = `${x},${z}`;

        // Remove existing tile if any
        if (this.tiles.has(key)) {
            const existingData = this.tiles.get(key)!;
            this.scene.remove(existingData.mesh);
            this.disposeObject(existingData.mesh);
            this.tiles.delete(key);
        }

        let tileObject: THREE.Object3D;
        const dirtMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x808080 });

        if (type === "dirt") {
            // Just dirt
            const geometry = new THREE.BoxGeometry(1, TILE_DIMENSIONS.DIRT_HEIGHT, 1);
            tileObject = new THREE.Mesh(geometry, dirtMat);
            tileObject.position.set(x, TILE_DIMENSIONS.DIRT_HEIGHT / 2, z);
        } else if (type === "grass") {
            // Dirt + Grass
            tileObject = new THREE.Group();

            const dirtGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.DIRT_HEIGHT, 1);
            const dirtMesh = new THREE.Mesh(dirtGeo, dirtMat);
            dirtMesh.position.y = TILE_DIMENSIONS.DIRT_HEIGHT / 2;
            tileObject.add(dirtMesh);

            const grassGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.GRASS_LAYER_HEIGHT, 1);
            const grassMesh = new THREE.Mesh(grassGeo, grassMat);
            grassMesh.position.y = TILE_DIMENSIONS.DIRT_HEIGHT + (TILE_DIMENSIONS.GRASS_LAYER_HEIGHT / 2);
            tileObject.add(grassMesh);

            tileObject.position.set(x, 0, z);
        } else if (type === "path") {
            // Dirt + Grass + Path
            tileObject = new THREE.Group();

            const dirtGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.DIRT_HEIGHT, 1);
            const dirtMesh = new THREE.Mesh(dirtGeo, dirtMat);
            dirtMesh.position.y = TILE_DIMENSIONS.DIRT_HEIGHT / 2;
            tileObject.add(dirtMesh);

            const grassGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.GRASS_LAYER_HEIGHT, 1);
            const grassMesh = new THREE.Mesh(grassGeo, grassMat);
            grassMesh.position.y = TILE_DIMENSIONS.DIRT_HEIGHT + (TILE_DIMENSIONS.GRASS_LAYER_HEIGHT / 2);
            tileObject.add(grassMesh);

            const pathGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.PATH_LAYER_HEIGHT, 1);
            const pathMesh = new THREE.Mesh(pathGeo, pathMat);
            pathMesh.position.y = TILE_DIMENSIONS.DIRT_HEIGHT + TILE_DIMENSIONS.GRASS_LAYER_HEIGHT + (TILE_DIMENSIONS.PATH_LAYER_HEIGHT / 2);
            tileObject.add(pathMesh);

            tileObject.position.set(x, 0, z);
        } else {
            tileObject = new THREE.Group();
        }

        this.scene.add(tileObject);
        this.tiles.set(key, { mesh: tileObject, type });
    }

    waterTile(x: number, z: number) {
        const key = `${x},${z}`;
        const tileData = this.tiles.get(key);

        if (!tileData || tileData.type !== "dirt") return;

        if (!tileData.isWatered) {
            tileData.isWatered = true;
            if (tileData.mesh instanceof THREE.Mesh) {
                const material = tileData.mesh.material as THREE.MeshStandardMaterial;
                material.color.setHex(0x5c2e0e); // Darker brown for wet dirt
            }
        }
    }

    getTileType(x: number, z: number): TileType | undefined {
        const key = `${x},${z}`;
        return this.tiles.get(key)?.type;
    }

    private disposeObject(obj: THREE.Object3D) {
        obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }

    dispose() {
        this.tiles.forEach((data) => {
            this.scene.remove(data.mesh);
            this.disposeObject(data.mesh);
        });
        this.tiles.clear();
    }
}
