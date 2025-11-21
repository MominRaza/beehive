import * as THREE from 'three';
import { Fence } from './objects/Fence';
import { ObjectManager } from './ObjectManager';

export class FenceManager extends ObjectManager<Fence> {
    public fencesGroup: THREE.Group;

    constructor(scene: THREE.Scene) {
        super(scene);
        this.fencesGroup = new THREE.Group();
        this.scene.add(this.fencesGroup);
        this.group = this.fencesGroup;
    }

    create(x: number, z: number) {
        this.createSingleFence(x, z);
    }

    updateFences(unlockedChunks: Set<string>) {
        const CHUNK_SIZE = 12;
        const neededFences = new Set<string>();

        unlockedChunks.forEach(key => {
            const [cx, cz] = key.split(',').map(Number);

            // Check neighbors
            const neighbors = {
                right: !unlockedChunks.has(`${cx + 1},${cz}`),
                left: !unlockedChunks.has(`${cx - 1},${cz}`),
                top: !unlockedChunks.has(`${cx},${cz + 1}`),
                bottom: !unlockedChunks.has(`${cx},${cz - 1}`)
            };

            // Chunk boundaries
            const minX = cx * CHUNK_SIZE - CHUNK_SIZE / 2;
            const maxX = cx * CHUNK_SIZE + CHUNK_SIZE / 2;
            const minZ = cz * CHUNK_SIZE - CHUNK_SIZE / 2;
            const maxZ = cz * CHUNK_SIZE + CHUNK_SIZE / 2;

            // Right Edge (x = maxX)
            if (neighbors.right) {
                for (let z = minZ; z < maxZ; z++) {
                    neededFences.add(`${maxX},${z + 0.5},${Math.PI / 2}`);
                }
            }

            // Left Edge (x = minX)
            if (neighbors.left) {
                for (let z = minZ; z < maxZ; z++) {
                    neededFences.add(`${minX},${z + 0.5},${Math.PI / 2}`);
                }
            }

            // Top Edge (z = maxZ)
            if (neighbors.top) {
                for (let x = minX; x < maxX; x++) {
                    neededFences.add(`${x + 0.5},${maxZ},0`);
                }
            }

            // Bottom Edge (z = minZ)
            if (neighbors.bottom) {
                for (let x = minX; x < maxX; x++) {
                    neededFences.add(`${x + 0.5},${minZ},0`);
                }
            }
        });

        // Remove old fences
        for (const [key, fence] of this.objects) {
            if (!neededFences.has(key)) {
                fence.dispose();
                this.objects.delete(key);
            }
        }

        // Add new fences
        neededFences.forEach(key => {
            if (!this.objects.has(key)) {
                const [x, z, rot] = key.split(',').map(Number);
                const fence = new Fence(this.group, x, z, rot);
                this.objects.set(key, fence);
            }
        });
    }

    public createSingleFence(x: number, z: number, rotationY: number = 0) {
        this.clear();
        const fence = new Fence(this.group, x, z, rotationY);
        this.objects.set("single", fence);
    }

    dispose() {
        super.dispose();
        this.scene.remove(this.fencesGroup);
    }

    clear() {
        super.dispose();
    }
}
