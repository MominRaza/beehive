import * as THREE from 'three';
import { Crop } from './Crop';

export class Wheat extends Crop {
    constructor(x: number, z: number) {
        super(x, z, 3, 2000); // 3 stages, 2 seconds per stage
        this.updateMesh();
    }

    protected updateMesh() {
        if (this.currentStage === 0) return super.updateMesh();

        this.mesh.clear();
        let geometry, material;

        if (this.currentStage === 1) {
            // Sprout
            geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2);
            material = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
        } else if (this.currentStage === 2) {
            // Tall grass
            geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
            material = new THREE.MeshStandardMaterial({ color: 0x00AA00 });
        } else {
            // Wheat bundle
            geometry = new THREE.CylinderGeometry(0.1, 0.05, 0.8);
            material = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.1 * (this.currentStage + 1);
        this.mesh.add(mesh);
    }
}
