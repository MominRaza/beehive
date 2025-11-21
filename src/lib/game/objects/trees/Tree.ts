import * as THREE from 'three';
import { GrowableObject } from '../GrowableObject';
import { SURFACE_HEIGHTS, GROWTH_TIMES, type TreeType } from '../../types';

export abstract class Tree extends GrowableObject {
    public maxGrowthStage: number = 2;
    public abstract type: TreeType;

    constructor(scene: THREE.Scene, x: number, z: number) {
        super(scene, x, z);
        this.mesh.position.y = SURFACE_HEIGHTS.GRASS;
        this.position.y = SURFACE_HEIGHTS.GRASS;
    }

    get growthTime(): number {
        return GROWTH_TIMES[this.type] || 10;
    }

    createMesh(): THREE.Object3D {
        const group = new THREE.Group();

        if (this.growthStage === 0) {
            // Sapling (Shared visual for now)
            // Trunk
            const trunkGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = 0.1; // Half height
            group.add(trunk);

            // Leaves
            const leavesGeo = new THREE.SphereGeometry(0.15);
            const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
            const leaves = new THREE.Mesh(leavesGeo, leavesMat);
            leaves.position.y = 0.2;
            group.add(leaves);
        } else {
            this.createSpecificMesh(group);
        }

        return group;
    }

    abstract createSpecificMesh(group: THREE.Group): void;
}
