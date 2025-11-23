import * as THREE from 'three';
import { GameObject } from '../GameObject';

export abstract class Tile extends GameObject {
    constructor(x: number, z: number) {
        super(x, z);
        this.addSoilBase();
    }

    private addSoilBase() {
        const geometry = new THREE.BoxGeometry(1, 0.2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown soil
        const soil = new THREE.Mesh(geometry, material);
        soil.position.y = -0.1; // Slightly below 0
        this.mesh.add(soil);
    }
}
