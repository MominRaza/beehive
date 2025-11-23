import * as THREE from 'three';
import { Tile } from './Tile';

export class Grass extends Tile {
    constructor(x: number, z: number) {
        super(x, z);
        this.addGrassLayer();
    }

    private addGrassLayer() {
        const geometry = new THREE.BoxGeometry(1, 0.1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
        const grass = new THREE.Mesh(geometry, material);
        grass.position.y = 0.05;
        this.mesh.add(grass);
    }
}
