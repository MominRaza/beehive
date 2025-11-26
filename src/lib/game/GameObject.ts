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

    enableShadows({ castShadow = true, receiveShadow = true } = {}) {
        this.mesh.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = castShadow;
                child.receiveShadow = receiveShadow;
            }
        });
    }

    update(_time: number): void {
        // Default implementation does nothing
    };
}
