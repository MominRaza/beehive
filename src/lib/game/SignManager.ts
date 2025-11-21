import * as THREE from 'three';
import { SURFACE_HEIGHTS } from './types';

export class SignManager {
    private scene: THREE.Scene;
    private signs: Map<string, THREE.Group> = new Map();
    public signsGroup: THREE.Group;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.signsGroup = new THREE.Group();
        this.scene.add(this.signsGroup);
    }

    updateSigns(buyableChunks: { cx: number, cz: number }[]) {
        // Identify which signs to keep and which to remove
        const newKeys = new Set(buyableChunks.map(c => `${c.cx},${c.cz}`));

        // Remove signs that are no longer needed
        for (const [key, sign] of this.signs) {
            if (!newKeys.has(key)) {
                this.signsGroup.remove(sign);
                this.disposeSign(sign);
                this.signs.delete(key);
            }
        }

        // Add new signs
        buyableChunks.forEach(chunk => {
            const key = `${chunk.cx},${chunk.cz}`;
            if (!this.signs.has(key)) {
                const sign = this.createSign(chunk.cx * 12, chunk.cz * 12);
                this.signs.set(key, sign);
                this.signsGroup.add(sign);
            }
        });
    }

    public createSingleSign(x: number, z: number) {
        this.clear();
        const sign = this.createSign(x, z);
        this.signsGroup.add(sign);
        this.signs.set("single", sign);
    }

    public createSign(x: number, z: number): THREE.Group {
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
        board.position.z = 0.05; // Slightly forward
        group.add(board);

        // Text (Optional, maybe just a colored rect for now to indicate "FOR SALE")
        const textGeo = new THREE.PlaneGeometry(0.8, 0.4);
        const textMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red "Sale" tag
        const text = new THREE.Mesh(textGeo, textMat);
        text.position.y = 1;
        text.position.z = 0.11;
        group.add(text);

        group.position.set(x, SURFACE_HEIGHTS.GRASS, z);

        // Add user data to identify this as a sign for a specific chunk
        group.userData = { isSign: true };

        return group;
    }

    private disposeSign(sign: THREE.Group) {
        sign.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                (child.material as THREE.Material).dispose();
            }
        });
    }

    dispose() {
        this.clear();
        this.scene.remove(this.signsGroup);
    }

    clear() {
        for (const sign of this.signs.values()) {
            this.signsGroup.remove(sign);
            this.disposeSign(sign);
        }
        this.signs.clear();
    }
}
