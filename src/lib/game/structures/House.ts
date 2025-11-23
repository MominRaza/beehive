import * as THREE from 'three';
import { Structure } from './Structure';

export class House extends Structure {
    constructor(x: number, z: number) {
        super(x, z, 2, 2); // 2x2 size
        this.buildHouse();
    }

    private buildHouse() {
        // Walls
        const wallsGeo = new THREE.BoxGeometry(1.8, 1.5, 1.8);
        const wallsMat = new THREE.MeshStandardMaterial({ color: 0xEFEFEF });
        const walls = new THREE.Mesh(wallsGeo, wallsMat);
        walls.position.y = 0.75;
        this.mesh.add(walls);

        // Roof
        const roofGeo = new THREE.ConeGeometry(1.5, 1, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 1.5 + 0.5;
        roof.rotation.y = Math.PI / 4;
        this.mesh.add(roof);

        // Door
        const doorGeo = new THREE.BoxGeometry(0.5, 1, 0.1);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x4A3C31 });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 0.5, 0.91);
        this.mesh.add(door);
    }
}
