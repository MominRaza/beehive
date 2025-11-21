import * as THREE from 'three';
import { Crop } from './Crop';
import type { CropType } from '../../types';

export class Carrot extends Crop {
    public type: CropType = 'carrot';

    createSpecificMesh(group: THREE.Group): void {
        // Leaves
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leafCount = this.growthStage === 1 ? 3 : 5;

        for (let i = 0; i < leafCount; i++) {
            const leaf = new THREE.Mesh(
                new THREE.ConeGeometry(0.05, 0.3, 4),
                leafMat
            );
            leaf.position.y = 0.15;
            leaf.rotation.x = (Math.random() - 0.5) * 1;
            leaf.rotation.z = (Math.random() - 0.5) * 1;
            leaf.castShadow = true;
            group.add(leaf);
        }

        if (this.growthStage === 2) {
            // Orange top poking out
            const carrotMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
            const carrotTop = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 0.1),
                carrotMat
            );
            carrotTop.position.y = 0.05;
            carrotTop.castShadow = true;
            group.add(carrotTop);
        }
    }
}
