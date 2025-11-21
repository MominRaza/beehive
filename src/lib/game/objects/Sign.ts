import * as THREE from 'three';
import { GameObject } from './GameObject';
import { SURFACE_HEIGHTS } from '../types';

export class Sign extends GameObject {
    constructor(parent: THREE.Object3D, x: number, z: number) {
        super(parent, x, z);
        this.mesh.position.y = SURFACE_HEIGHTS.GRASS;
        this.position.y = SURFACE_HEIGHTS.GRASS;

        // Specific user data for sign interaction
        this.mesh.userData.isSign = true;
    }

    createMesh(): THREE.Object3D {
        const group = new THREE.Group();

        // Post
        const postGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.y = 0.5;
        group.add(post);

        // Board
        const boardGeo = new THREE.BoxGeometry(1, 0.6, 0.1);
        const boardMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c }); // Tan
        const board = new THREE.Mesh(boardGeo, boardMat);
        board.position.y = 1;
        board.position.z = 0.06; // Slightly forward
        group.add(board);

        // Text (Optional, maybe just a colored rect for now to indicate "FOR SALE")
        const textGeo = new THREE.PlaneGeometry(0.8, 0.4);
        const textMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red "Sale" tag
        const text = new THREE.Mesh(textGeo, textMat);
        text.position.y = 1;
        text.position.z = 0.12;
        group.add(text);

        return group;
    }
}
