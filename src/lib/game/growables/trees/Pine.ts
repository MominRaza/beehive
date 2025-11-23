import * as THREE from 'three';
import { Tree } from './Tree';

export class Pine extends Tree {
    constructor(x: number, z: number) {
        super(x, z, 3, 5000); // 3 stages, 5 seconds per stage
        this.updateMesh();
    }

    updateMesh() {
        this.mesh.clear();

        // Trunk
        const trunkHeight = 0.5 + (this.currentStage * 0.5);
        const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, trunkHeight);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4A3C31 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = trunkHeight / 2;
        this.mesh.add(trunk);

        // Foliage (Cone)
        if (this.currentStage > 0) {
            const foliageHeight = 1 + (this.currentStage * 0.5);
            const foliageGeo = new THREE.ConeGeometry(0.5 + (this.currentStage * 0.2), foliageHeight, 8);
            const foliageMat = new THREE.MeshStandardMaterial({ color: 0x006400 });
            const foliage = new THREE.Mesh(foliageGeo, foliageMat);
            foliage.position.y = trunkHeight + (foliageHeight / 2) - 0.2;
            this.mesh.add(foliage);
        }
    }
}
