import * as THREE from 'three';
import { Tree } from './Tree';
import type { TreeType } from '../../types';

export class OakTree extends Tree {
    public type: TreeType = "oak";

    createSpecificMesh(group: THREE.Group): void {
        let trunkHeight = 0.2;
        let trunkRadius = 0.05;
        let leavesRadius = 0.15;
        let leavesY = 0.2;

        if (this.growthStage === 1) {
            // Small Tree
            trunkHeight = 0.5;
            trunkRadius = 0.1;
            leavesRadius = 0.3;
            leavesY = 0.5;
        } else {
            // Big Tree
            trunkHeight = 1.0;
            trunkRadius = 0.15;
            leavesRadius = 0.5;
            leavesY = 1.0;
        }

        const trunkGeo = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = trunkHeight / 2;
        group.add(trunk);

        const leavesGeo = new THREE.SphereGeometry(leavesRadius);
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = leavesY;
        group.add(leaves);
    }
}
