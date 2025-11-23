import * as THREE from 'three';
import { Crop } from './Crop';

export class Carrot extends Crop {
    constructor(x: number, z: number) {
        super(x, z, 3, 2000);
        this.updateMesh();
    }

    protected updateMesh() {
        if (this.currentStage === 0) return super.updateMesh();

        this.mesh.clear();
        let geometry, material;

        if (this.currentStage === 1) {
            // Sprout
            geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1);
            material = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
        } else if (this.currentStage === 2) {
            // Leaves
            geometry = new THREE.ConeGeometry(0.1, 0.3, 4);
            material = new THREE.MeshStandardMaterial({ color: 0x00AA00 });
        } else {
            // Orange base (top of carrot visible) + leaves
            const group = new THREE.Group();

            const baseGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.1);
            const baseMat = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
            const base = new THREE.Mesh(baseGeo, baseMat);
            group.add(base);

            const leavesGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
            const leavesMat = new THREE.MeshStandardMaterial({ color: 0x00AA00 });
            const leaves = new THREE.Mesh(leavesGeo, leavesMat);
            leaves.position.y = 0.25;
            group.add(leaves);

            this.mesh.add(group);
            return;
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.1;
        this.mesh.add(mesh);
    }
}
