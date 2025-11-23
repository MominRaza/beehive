import * as THREE from 'three';

export abstract class GameObject {
    public x: number;
    public z: number;
    public mesh: THREE.Group;

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

    abstract update(time: number): void;
}
