import * as THREE from 'three';
import { GameObject } from './GameObject';
import { SURFACE_HEIGHTS } from '../types';

export class Structure extends GameObject {
    constructor(parent: THREE.Object3D, x: number, z: number) {
        super(parent, x, z);
        this.mesh.position.y = SURFACE_HEIGHTS.GRASS;
        this.position.y = SURFACE_HEIGHTS.GRASS;
    }

    createMesh(): THREE.Object3D {
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

        return group;
    }
}
