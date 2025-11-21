import * as THREE from 'three';
import { type TileType, TILE_DIMENSIONS } from './types';

const GRID_SIZE = 100; // 100x100 grid
const GRID_OFFSET = 50; // Center at 0,0
const MAX_INSTANCES = GRID_SIZE * GRID_SIZE;

export class GridManager {
    private scene: THREE.Scene;
    public tiles = new Map<string, { type: TileType; isWatered?: boolean }>();

    private dirtMesh: THREE.InstancedMesh;
    private grassMesh: THREE.InstancedMesh;
    private pathMesh: THREE.InstancedMesh;

    private dummy = new THREE.Object3D();

    constructor(scene: THREE.Scene) {
        this.scene = scene;

        // Dirt
        const dirtGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.DIRT_HEIGHT, 1);
        const dirtMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        this.dirtMesh = new THREE.InstancedMesh(dirtGeo, dirtMat, MAX_INSTANCES);
        this.dirtMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.dirtMesh.castShadow = true;
        this.dirtMesh.receiveShadow = true;
        this.dirtMesh.frustumCulled = false;

        // Grass
        const grassGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.GRASS_LAYER_HEIGHT, 1);
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        this.grassMesh = new THREE.InstancedMesh(grassGeo, grassMat, MAX_INSTANCES);
        this.grassMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.grassMesh.castShadow = true;
        this.grassMesh.receiveShadow = true;
        this.grassMesh.frustumCulled = false;

        // Path
        const pathGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.PATH_LAYER_HEIGHT, 1);
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
        this.pathMesh = new THREE.InstancedMesh(pathGeo, pathMat, MAX_INSTANCES);
        this.pathMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.pathMesh.castShadow = true;
        this.pathMesh.receiveShadow = true;
        this.pathMesh.frustumCulled = false;

        this.scene.add(this.dirtMesh);
        this.scene.add(this.grassMesh);
        this.scene.add(this.pathMesh);

        // Initialize all to hidden
        for (let i = 0; i < MAX_INSTANCES; i++) {
            this.hideInstance(this.dirtMesh, i);
            this.hideInstance(this.grassMesh, i);
            this.hideInstance(this.pathMesh, i);
        }
    }

    private getIndex(x: number, z: number): number {
        const ix = Math.floor(x) + GRID_OFFSET;
        const iz = Math.floor(z) + GRID_OFFSET;
        if (ix < 0 || ix >= GRID_SIZE || iz < 0 || iz >= GRID_SIZE) return -1;
        return ix + iz * GRID_SIZE;
    }

    createTile(x: number, z: number, type: TileType) {
        const key = `${x},${z}`;
        const index = this.getIndex(x, z);
        if (index === -1) return;

        this.tiles.set(key, { type, isWatered: false });

        // 1. Dirt (Always present)
        this.dummy.scale.set(1, 1, 1);
        this.dummy.position.set(x, TILE_DIMENSIONS.DIRT_HEIGHT / 2, z);
        this.dummy.updateMatrix();
        this.dirtMesh.setMatrixAt(index, this.dummy.matrix);
        this.dirtMesh.setColorAt(index, new THREE.Color(0x8b4513)); // Reset color
        this.dirtMesh.instanceMatrix.needsUpdate = true;
        if (this.dirtMesh.instanceColor) this.dirtMesh.instanceColor.needsUpdate = true;

        // 2. Grass
        if (type === "grass" || type === "path") {
            this.dummy.scale.set(1, 1, 1);
            this.dummy.position.set(x, TILE_DIMENSIONS.DIRT_HEIGHT + TILE_DIMENSIONS.GRASS_LAYER_HEIGHT / 2, z);
            this.dummy.updateMatrix();
            this.grassMesh.setMatrixAt(index, this.dummy.matrix);
        } else {
            this.hideInstance(this.grassMesh, index);
        }
        this.grassMesh.instanceMatrix.needsUpdate = true;

        // 3. Path
        if (type === "path") {
            this.dummy.scale.set(1, 1, 1);
            this.dummy.position.set(x, TILE_DIMENSIONS.DIRT_HEIGHT + TILE_DIMENSIONS.GRASS_LAYER_HEIGHT + TILE_DIMENSIONS.PATH_LAYER_HEIGHT / 2, z);
            this.dummy.updateMatrix();
            this.pathMesh.setMatrixAt(index, this.dummy.matrix);
        } else {
            this.hideInstance(this.pathMesh, index);
        }
        this.pathMesh.instanceMatrix.needsUpdate = true;
    }

    waterTile(x: number, z: number) {
        const key = `${x},${z}`;
        const tileData = this.tiles.get(key);
        const index = this.getIndex(x, z);

        if (!tileData || tileData.type !== "dirt" || index === -1) return;

        if (!tileData.isWatered) {
            tileData.isWatered = true;
            this.dirtMesh.setColorAt(index, new THREE.Color(0x5c2e0e));
            if (this.dirtMesh.instanceColor) this.dirtMesh.instanceColor.needsUpdate = true;
        }
    }

    getTileType(x: number, z: number): TileType | undefined {
        const key = `${x},${z}`;
        return this.tiles.get(key)?.type;
    }

    private hideInstance(mesh: THREE.InstancedMesh, index: number) {
        this.dummy.position.set(0, -1000, 0);
        this.dummy.scale.set(0, 0, 0);
        this.dummy.updateMatrix();
        mesh.setMatrixAt(index, this.dummy.matrix);
    }

    dispose() {
        this.scene.remove(this.dirtMesh);
        this.scene.remove(this.grassMesh);
        this.scene.remove(this.pathMesh);

        this.dirtMesh.dispose();
        this.grassMesh.dispose();
        this.pathMesh.dispose();

        this.tiles.clear();
    }

    clear() {
        // Hide all instances
        for (let i = 0; i < MAX_INSTANCES; i++) {
            this.hideInstance(this.dirtMesh, i);
            this.hideInstance(this.grassMesh, i);
            this.hideInstance(this.pathMesh, i);
        }
        this.dirtMesh.instanceMatrix.needsUpdate = true;
        this.grassMesh.instanceMatrix.needsUpdate = true;
        this.pathMesh.instanceMatrix.needsUpdate = true;

        this.tiles.clear();
    }
}
