import * as THREE from 'three';
import { Tree } from './Tree';

export class Oak extends Tree {
    constructor(x: number, z: number) {
        super(x, z, 3, 5000);
        this.updateMesh();
    }

    protected updateMesh() {
        this.mesh.clear();

        // Trunk
        const trunkHeight = 0.5 + (this.currentStage * 0.4);
        const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, trunkHeight);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4A3C31 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = trunkHeight / 2;
        this.mesh.add(trunk);

        // Foliage (Round)
        if (this.currentStage > 0) {
            const foliageSize = 0.5 + (this.currentStage * 0.3);
            const foliageGeo = new THREE.DodecahedronGeometry(foliageSize);
            const foliageMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
            const foliage = new THREE.Mesh(foliageGeo, foliageMat);
            foliage.position.y = trunkHeight + (foliageSize / 2);
            this.mesh.add(foliage);
        }
    }
}
