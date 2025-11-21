import * as THREE from 'three';
import { Tree } from './Tree';
import type { TreeType } from '../../types';

export class PineTree extends Tree {
    public type: TreeType = "pine";

    createSpecificMesh(group: THREE.Group): void {
        let trunkHeight = 0.2;
        let trunkRadius = 0.05;
        let leavesHeight = 0.3;
        let leavesRadius = 0.15;
        let leavesY = 0.2;

        if (this.growthStage === 1) {
            // Small Tree
            trunkHeight = 0.5;
            trunkRadius = 0.08;
            leavesHeight = 0.8;
            leavesRadius = 0.25;
            leavesY = 0.5;
        } else {
            // Big Tree
            trunkHeight = 1.0;
            trunkRadius = 0.12;
            leavesHeight = 1.5;
            leavesRadius = 0.4;
            leavesY = 0.8;
        }

        const trunkGeo = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033 }); // Darker wood
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = trunkHeight / 2;
        group.add(trunk);

        // Pine leaves are cone shaped
        const leavesGeo = new THREE.ConeGeometry(leavesRadius, leavesHeight, 8);
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57 }); // Sea Green
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = leavesY + leavesHeight / 2;
        group.add(leaves);
    }
}
