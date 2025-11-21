import * as THREE from 'three';
import { GameObject } from './GameObject';
import { SURFACE_HEIGHTS } from '../types';

export class Fence extends GameObject {
    private rotationY: number;

    constructor(parent: THREE.Object3D, x: number, z: number, rotationY: number = 0) {
        // We need to set rotation before calling super because super calls createMesh
        // But we can't access 'this' before super.
        // So we'll handle rotation after super.
        super(parent, x, z);
        this.rotationY = rotationY;
        this.mesh.rotation.y = rotationY;
        this.mesh.position.y = SURFACE_HEIGHTS.DIRT;
        this.position.y = SURFACE_HEIGHTS.DIRT;
    }

    createMesh(): THREE.Object3D {
        const group = new THREE.Group();

        // Posts: Taller and thicker
        const postGeo = new THREE.BoxGeometry(0.2, 1.1, 0.2);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

        // Post 1 (Left Edge) - Centered at -0.5
        const post1 = new THREE.Mesh(postGeo, postMat);
        post1.position.set(-0.5, 0.55, 0);
        group.add(post1);

        // Post 2 (Right Edge) - Centered at 0.5
        const post2 = new THREE.Mesh(postGeo, postMat);
        post2.position.set(0.5, 0.55, 0);
        group.add(post2);

        // Rails: Spanning the full width
        const railGeo = new THREE.BoxGeometry(1.0, 0.12, 0.08);
        const railMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

        // Rail 1 (Top)
        const rail1 = new THREE.Mesh(railGeo, railMat);
        rail1.position.set(0, 0.85, 0);
        group.add(rail1);

        // Rail 2 (Bottom)
        const rail2 = new THREE.Mesh(railGeo, railMat);
        rail2.position.set(0, 0.45, 0);
        group.add(rail2);

        return group;
    }
}
