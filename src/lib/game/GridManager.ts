import * as THREE from 'three';
import { type TileType, TILE_DIMENSIONS } from './types';

const GRID_SIZE = 60; // 60x60 grid
const GRID_OFFSET = 30; // Center at 0,0
const MAX_INSTANCES = GRID_SIZE * GRID_SIZE;

export class GridManager {
    private scene: THREE.Scene;
    public tiles = new Map<string, { type: TileType; isWatered?: boolean }>();

    private dirtMesh: THREE.InstancedMesh;
    private grassMesh: THREE.InstancedMesh;
    private pathMesh: THREE.InstancedMesh;
    private chunkLines!: THREE.LineSegments;

    private dummy = new THREE.Object3D();

    constructor(scene: THREE.Scene) {
        this.scene = scene;

        // Dirt
        const dirtGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.DIRT_HEIGHT, 1);
        const dirtMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        this.dirtMesh = this.createMesh(dirtGeo, dirtMat);

        // Grass
        const grassGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.GRASS_LAYER_HEIGHT, 1);
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        this.grassMesh = this.createMesh(grassGeo, grassMat);

        // Path
        const pathGeo = new THREE.BoxGeometry(1, TILE_DIMENSIONS.PATH_LAYER_HEIGHT, 1);
        const pathMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
        this.pathMesh = this.createMesh(pathGeo, pathMat);

        this.createChunkLines();

        // Initialize all to hidden
        for (let i = 0; i < MAX_INSTANCES; i++) {
            this.hideInstance(this.dirtMesh, i);
            this.hideInstance(this.grassMesh, i);
            this.hideInstance(this.pathMesh, i);
        }
    }

    private createMesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.InstancedMesh {
        const mesh = new THREE.InstancedMesh(geometry, material, MAX_INSTANCES);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        this.scene.add(mesh);
        return mesh;
    }

    private createChunkLines() {
        const chunkSize = 12;
        const extent = 30; // 60x60 grid, so -30 to 30

        const vertices: number[] = [];

        // Vertical lines (along Z)
        // Start from center (0,0) which is middle of chunk 0,0.
        // Chunk 0,0 spans -6 to 6.
        // So lines are at +/- 6, +/- 18, +/- 30, +/- 42
        for (let x = -6; x < extent; x += chunkSize) {
            vertices.push(x, 0.2, -extent);
            vertices.push(x, 0.2, extent);
            if (x !== -6) { // Mirror for negative side, avoid double counting if we started at 0
                vertices.push(-x, 0.2, -extent);
                vertices.push(-x, 0.2, extent);
            }
        }
        // Fix loop logic:
        // We want lines at 6, 18, 30, 42.
        // And -6, -18, -30, -42.

        const lines = [];
        for (let i = 6; i < extent; i += chunkSize) {
            lines.push(i);
            lines.push(-i);
        }

        lines.forEach(pos => {
            // Line along Z at x=pos
            vertices.push(pos, 0.2, -extent);
            vertices.push(pos, 0.2, extent);

            // Line along X at z=pos
            vertices.push(-extent, 0.2, pos);
            vertices.push(extent, 0.2, pos);
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });

        this.chunkLines = new THREE.LineSegments(geometry, material);
        this.scene.add(this.chunkLines);
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

        // Helper to set matrix
        const setMatrix = (mesh: THREE.InstancedMesh, y: number) => {
            this.dummy.scale.set(1, 1, 1);
            this.dummy.position.set(x, y, z);
            this.dummy.updateMatrix();
            mesh.setMatrixAt(index, this.dummy.matrix);
            mesh.instanceMatrix.needsUpdate = true;
        };

        // 1. Dirt (Always present)
        setMatrix(this.dirtMesh, TILE_DIMENSIONS.DIRT_HEIGHT / 2);
        this.dirtMesh.setColorAt(index, new THREE.Color(0x8b4513)); // Reset color
        if (this.dirtMesh.instanceColor) this.dirtMesh.instanceColor.needsUpdate = true;

        // 2. Grass
        if (type === "grass" || type === "path") {
            setMatrix(this.grassMesh, TILE_DIMENSIONS.DIRT_HEIGHT + TILE_DIMENSIONS.GRASS_LAYER_HEIGHT / 2);
        } else {
            this.hideInstance(this.grassMesh, index);
        }

        // 3. Path
        if (type === "path") {
            setMatrix(this.pathMesh, TILE_DIMENSIONS.DIRT_HEIGHT + TILE_DIMENSIONS.GRASS_LAYER_HEIGHT + TILE_DIMENSIONS.PATH_LAYER_HEIGHT / 2);
        } else {
            this.hideInstance(this.pathMesh, index);
        }
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
        this.scene.remove(this.chunkLines);

        this.dirtMesh.dispose();
        this.grassMesh.dispose();
        this.pathMesh.dispose();
        this.chunkLines.geometry.dispose();
        (this.chunkLines.material as THREE.Material).dispose();

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
