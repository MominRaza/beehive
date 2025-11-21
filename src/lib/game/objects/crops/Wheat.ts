import * as THREE from 'three';
import { Crop } from './Crop';
import type { CropType } from '../../types';

export class Wheat extends Crop {
    public type: CropType = 'wheat';

    createSpecificMesh(group: THREE.Group): void {
        const color = this.growthStage === 2 ? 0xeebb00 : 0x32cd32; // Gold or Green
        const material = new THREE.MeshStandardMaterial({ color });

        const count = this.growthStage === 1 ? 4 : 7;
        const height = this.growthStage === 1 ? 0.4 : 0.6;

        for (let i = 0; i < count; i++) {
            const stalk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, height),
                material
            );
            // Randomize slightly
            const angle = (i / count) * Math.PI * 2 + Math.random();
            const radius = 0.15 * Math.random();
            stalk.position.set(Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius);
            stalk.rotation.x = (Math.random() - 0.5) * 0.3;
            stalk.rotation.z = (Math.random() - 0.5) * 0.3;
            stalk.castShadow = true;
            group.add(stalk);

            // Wheat head (only for stage 2)
            if (this.growthStage === 2) {
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.04, 0.15, 0.04),
                    material
                );
                head.position.y = height / 2 + 0.075;
                stalk.add(head);
            }
        }
    }
}
