import * as THREE from 'three';
import { Structure } from './objects/Structure';

export class StructureManager {
    private scene: THREE.Scene;
    private hut: Structure | null = null;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.createHut(0, 0); // Default position
    }

    createHut(x: number, z: number) {
        if (this.hut) {
            this.hut.dispose();
        }

        this.hut = new Structure(this.scene, x, z);
    }

    dispose() {
        if (this.hut) {
            this.hut.dispose();
        }
    }
}
