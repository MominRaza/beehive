import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SURFACE_HEIGHTS } from './types';

export class FenceManager {
    private scene: THREE.Scene;
    private fencesGroup: THREE.Group;
    private fenceMesh: THREE.InstancedMesh;
    private dummy = new THREE.Object3D();
    private MAX_FENCES = 2000; // Estimate

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.fencesGroup = new THREE.Group();
        this.scene.add(this.fencesGroup);

        // Create InstancedMesh for fences
        // A post and rail fence: 2 posts at the edges, 2 rails
        // This ensures corners and adjacent fences connect seamlessly
        const geometries: THREE.BufferGeometry[] = [];

        // Posts: Taller and thicker
        const postGeo = new THREE.BoxGeometry(0.2, 1.1, 0.2);

        // Rails: Spanning the full width
        const railGeo = new THREE.BoxGeometry(1.0, 0.12, 0.08);

        // Post 1 (Left Edge) - Centered at -0.5
        const post1 = postGeo.clone();
        post1.translate(-0.5, 0.55, 0); // y=0.55 so it sits on ground
        geometries.push(post1);

        // Post 2 (Right Edge) - Centered at 0.5
        const post2 = postGeo.clone();
        post2.translate(0.5, 0.55, 0);
        geometries.push(post2);

        // Rail 1 (Top)
        const rail1 = railGeo.clone();
        rail1.translate(0, 0.85, 0);
        geometries.push(rail1);

        // Rail 2 (Bottom)
        const rail2 = railGeo.clone();
        rail2.translate(0, 0.45, 0);
        geometries.push(rail2);

        const geometry = BufferGeometryUtils.mergeGeometries(geometries);

        // Cleanup intermediate geometries
        postGeo.dispose();
        railGeo.dispose();
        geometries.forEach(g => g.dispose());

        const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Brown
        this.fenceMesh = new THREE.InstancedMesh(geometry, material, this.MAX_FENCES);
        this.fenceMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.fenceMesh.castShadow = true;
        this.fenceMesh.receiveShadow = true;
        this.fenceMesh.count = 0; // Start with 0 visible fences
        this.fencesGroup.add(this.fenceMesh);
    }

    updateFences(unlockedChunks: Set<string>) {
        let instanceIndex = 0;
        const CHUNK_SIZE = 12;

        // Reset all instances
        for (let i = 0; i < this.MAX_FENCES; i++) {
            this.dummy.position.set(0, -1000, 0);
            this.dummy.updateMatrix();
            this.fenceMesh.setMatrixAt(i, this.dummy.matrix);
        }

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

            // Draw fences along the edges if neighbor is locked

            // Right Edge (x = maxX)
            if (neighbors.right) {
                for (let z = minZ; z < maxZ; z++) {
                    this.placeFence(maxX, z + 0.5, Math.PI / 2, instanceIndex++);
                }
            }

            // Left Edge (x = minX)
            if (neighbors.left) {
                for (let z = minZ; z < maxZ; z++) {
                    this.placeFence(minX, z + 0.5, Math.PI / 2, instanceIndex++);
                }
            }

            // Top Edge (z = maxZ)
            if (neighbors.top) {
                for (let x = minX; x < maxX; x++) {
                    this.placeFence(x + 0.5, maxZ, 0, instanceIndex++);
                }
            }

            // Bottom Edge (z = minZ)
            if (neighbors.bottom) {
                for (let x = minX; x < maxX; x++) {
                    this.placeFence(x + 0.5, minZ, 0, instanceIndex++);
                }
            }
        });

        this.fenceMesh.count = instanceIndex;
        this.fenceMesh.instanceMatrix.needsUpdate = true;
    }

    public createSingleFence(x: number, z: number, rotationY: number = 0) {
        this.dummy.position.set(x, SURFACE_HEIGHTS.DIRT, z);
        this.dummy.rotation.set(0, rotationY, 0);
        this.dummy.scale.set(1, 1, 1);
        this.dummy.updateMatrix();

        // We need to ensure the mesh has count > 0
        if (this.fenceMesh.count === 0) {
            this.fenceMesh.count = 1;
        }
        this.fenceMesh.setMatrixAt(0, this.dummy.matrix);
        this.fenceMesh.instanceMatrix.needsUpdate = true;
    }

    private placeFence(x: number, z: number, rotationY: number, index: number) {
        if (index >= this.MAX_FENCES) return;

        this.dummy.position.set(x, SURFACE_HEIGHTS.DIRT, z);
        this.dummy.rotation.set(0, rotationY, 0);

        // If rotation is 0 (along Z axis), we need to rotate the box geometry which is along X by default?
        // BoxGeometry(1, 0.5, 0.1) -> Length 1 along X.
        // So rotation 0 means fence runs along X.
        // Rotation 90 (PI/2) means fence runs along Z.

        // Wait, my logic in updateFences:
        // Right Edge: x is constant. Fence runs along Z. So need 90 deg rotation.
        // Top Edge: z is constant. Fence runs along X. So need 0 deg rotation.

        // Let's correct the calls in updateFences.

        this.dummy.scale.set(1, 1, 1);
        this.dummy.updateMatrix();
        this.fenceMesh.setMatrixAt(index, this.dummy.matrix);
    }

    dispose() {
        this.scene.remove(this.fencesGroup);
        this.fenceMesh.dispose();
    }

    clear() {
        this.dummy.position.set(0, -1000, 0);
        this.dummy.updateMatrix();
        for (let i = 0; i < this.MAX_FENCES; i++) {
            this.fenceMesh.setMatrixAt(i, this.dummy.matrix);
        }
        this.fenceMesh.count = 0;
        this.fenceMesh.instanceMatrix.needsUpdate = true;
    }
}
