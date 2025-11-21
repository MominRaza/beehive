import * as THREE from 'three';

export abstract class GameObject {
    public scene: THREE.Object3D; // Can be Scene or Group
    public mesh: THREE.Object3D;
    public position: THREE.Vector3;
    public id: string;

    constructor(parent: THREE.Object3D, x: number, z: number) {
        this.scene = parent;
        this.position = new THREE.Vector3(x, 0, z);
        this.id = `${x},${z}`;
        this.mesh = this.createMesh();
        this.mesh.position.copy(this.position);

        this.mesh.userData = {
            isGameObject: true,
            id: this.id,
            type: this.constructor.name
        };

        this.scene.add(this.mesh);
    }

    abstract createMesh(): THREE.Object3D;

    dispose() {
        this.scene.remove(this.mesh);
        this.disposeObject(this.mesh);
    }

    protected disposeObject(obj: THREE.Object3D) {
        obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    (child.material as THREE.Material).dispose();
                }
            }
        });
    }
}
