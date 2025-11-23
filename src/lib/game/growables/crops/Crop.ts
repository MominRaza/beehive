import * as THREE from 'three';
import { GrowableObject } from '../GrowableObject';

export abstract class Crop extends GrowableObject {
    constructor(x: number, z: number, maxStage: number, growthDuration: number) {
        super(x, z, maxStage, growthDuration);
        this.mesh.position.y = 0.1;
    }

    protected updateMesh(): void {
        this.mesh.clear();
        let geometry, material;
        geometry = new THREE.SphereGeometry(0.05);
        material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const mesh = new THREE.Mesh(geometry, material);
        this.mesh.add(mesh);
    }
}
