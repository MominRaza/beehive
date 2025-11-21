import * as THREE from 'three';
import { SURFACE_HEIGHTS } from './types';

export class StructureManager {
    private scene: THREE.Scene;
    private hut: THREE.Group | null = null;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.createHut(0, 0); // Default position
    }

    createHut(x: number, z: number) {
        if (this.hut) {
            this.scene.remove(this.hut);
        }

        const group = new THREE.Group();

        // Base/Walls
        const wallsGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
        const wallsMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Brown
        const walls = new THREE.Mesh(wallsGeo, wallsMat);
        walls.position.y = 0.5;
        group.add(walls);

        // Roof
        const roofGeo = new THREE.ConeGeometry(1.2, 0.8, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0xa52a2a }); // Reddish brown
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 1.4;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        // Door
        const doorGeo = new THREE.PlaneGeometry(0.4, 0.6);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 0.3, 0.76);
        group.add(door);

        // Place on top of grass
        group.position.set(x, SURFACE_HEIGHTS.GRASS, z);
        this.scene.add(group);
        this.hut = group;
    }

    dispose() {
        if (this.hut) {
            this.scene.remove(this.hut);
            this.hut.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    (child.material as THREE.Material).dispose();
                }
            });
        }
    }
}
