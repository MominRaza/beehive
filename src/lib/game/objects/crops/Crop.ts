import * as THREE from 'three';
import { GrowableObject } from '../GrowableObject';
import { SURFACE_HEIGHTS, GROWTH_TIMES, type CropType } from '../../types';

export abstract class Crop extends GrowableObject {
    public maxGrowthStage: number = 2;
    public abstract type: CropType;

    constructor(scene: THREE.Scene, x: number, z: number) {
        super(scene, x, z);
        this.mesh.position.y = SURFACE_HEIGHTS.DIRT;
        this.position.y = SURFACE_HEIGHTS.DIRT;
    }

    get growthTime(): number {
        return GROWTH_TIMES[this.type] || 2;
    }

    createMesh(): THREE.Object3D {
        const group = new THREE.Group();

        if (this.growthStage === 0) {
            // Sprout: 2 small leaves (Shared visual for all crops at stage 0)
            const leafGeo = new THREE.BoxGeometry(0.05, 0.1, 0.02);
            const leafMat = new THREE.MeshStandardMaterial({ color: 0x32cd32 });

            const leaf1 = new THREE.Mesh(leafGeo, leafMat);
            leaf1.position.set(0.05, 0.05, 0);
            leaf1.rotation.z = -Math.PI / 6;
            leaf1.castShadow = true;

            const leaf2 = new THREE.Mesh(leafGeo, leafMat);
            leaf2.position.set(-0.05, 0.05, 0);
            leaf2.rotation.z = Math.PI / 6;
            leaf2.castShadow = true;

            group.add(leaf1, leaf2);
        } else {
            this.createSpecificMesh(group);
        }

        return group;
    }

    abstract createSpecificMesh(group: THREE.Group): void;
}
