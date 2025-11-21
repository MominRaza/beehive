import * as THREE from 'three';
import { Crop } from './Crop';
import type { CropType } from '../../types';

export class Tomato extends Crop {
    public type: CropType = 'tomato';

    createSpecificMesh(group: THREE.Group): void {
        // Bush
        const bushMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });

        // Main stem
        const mainStem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.5),
            bushMat
        );
        mainStem.position.y = 0.25;
        mainStem.castShadow = true;
        group.add(mainStem);

        // Leaves/Branches
        const branchCount = this.growthStage === 1 ? 3 : 6;
        for (let i = 0; i < branchCount; i++) {
            const branch = new THREE.Mesh(
                new THREE.BoxGeometry(0.25, 0.02, 0.02),
                bushMat
            );
            branch.position.y = 0.1 + Math.random() * 0.3;
            branch.rotation.y = Math.random() * Math.PI;
            branch.rotation.z = (Math.random() - 0.5) * 0.5;
            branch.castShadow = true;
            group.add(branch);
        }

        if (this.growthStage === 2) {
            // Tomatoes
            const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xff6347 });
            const positions = [
                [0.1, 0.2, 0], [-0.1, 0.3, 0.05], [0, 0.4, -0.1], [0.05, 0.15, -0.05]
            ];

            positions.forEach(pos => {
                const tomato = new THREE.Mesh(
                    new THREE.SphereGeometry(0.06, 8, 8),
                    tomatoMat
                );
                tomato.position.set(pos[0], pos[1], pos[2]);
                tomato.castShadow = true;
                group.add(tomato);
            });
        }
    }
}
