import * as THREE from 'three';
import { Tile } from './Tile';

export class Path extends Tile {
    constructor(x: number, z: number) {
        super(x, z);
        this.addPathLayer();
    }

    private addPathLayer() {
        const geometry = new THREE.BoxGeometry(1, 0.05, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const path = new THREE.Mesh(geometry, material);
        path.position.y = 0.025;
        this.mesh.add(path);
    }
}
