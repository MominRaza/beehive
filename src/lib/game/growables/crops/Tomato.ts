import * as THREE from 'three';
import { Crop } from './Crop';

export class Tomato extends Crop {
    constructor(x: number, z: number) {
        super(x, z, 3, 2000);
        this.updateMesh();
    }

    updateMesh() {
        this.mesh.clear();
        let geometry, material;

        if (this.currentStage === 0) {
            // Seeds
            geometry = new THREE.SphereGeometry(0.05);
            material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
            const mesh = new THREE.Mesh(geometry, material);
            this.mesh.add(mesh);
        } else if (this.currentStage === 1) {
            // Sprout
            geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2);
            material = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
            const mesh = new THREE.Mesh(geometry, material);
            this.mesh.add(mesh);
        } else if (this.currentStage === 2) {
            // Bush
            geometry = new THREE.SphereGeometry(0.2);
            material = new THREE.MeshStandardMaterial({ color: 0x00AA00 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = 0.2;
            this.mesh.add(mesh);
        } else {
            // Bush with tomatoes
            const group = new THREE.Group();

            const bushGeo = new THREE.SphereGeometry(0.3);
            const bushMat = new THREE.MeshStandardMaterial({ color: 0x00AA00 });
            const bush = new THREE.Mesh(bushGeo, bushMat);
            bush.position.y = 0.3;
            group.add(bush);

            const fruitGeo = new THREE.SphereGeometry(0.05);
            const fruitMat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });

            const f1 = new THREE.Mesh(fruitGeo, fruitMat);
            f1.position.set(0.15, 0.3, 0.15);
            group.add(f1);

            const f2 = new THREE.Mesh(fruitGeo, fruitMat);
            f2.position.set(-0.15, 0.4, 0);
            group.add(f2);

            this.mesh.add(group);
        }
    }
}
