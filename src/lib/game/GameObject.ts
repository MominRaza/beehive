import * as THREE from 'three';

export abstract class GameObject {
    private x: number;
    private z: number;
    protected mesh: THREE.Group;

    constructor(x: number, z: number) {
        this.x = x;
        this.z = z;
        this.mesh = new THREE.Group();
        this.mesh.position.set(x, 0, z);
    }

    addToScene(scene: THREE.Scene) {
        scene.add(this.mesh);
    }

    removeFromScene(scene: THREE.Scene) {
        scene.remove(this.mesh);
    }

    update(time: number): void {
        // Default implementation does nothing
    };
}
