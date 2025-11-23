import * as THREE from 'three';
import { Tree } from '../Tree';

export abstract class FruitTree extends Tree {
    constructor(x: number, z: number) {
        super(x, z, 4, 5000); // 4 stages (last one is fruit)
        this.updateMesh(); // Initial mesh update
    }

    harvest() {
        if (this.currentStage === this.maxStage) {
            this.currentStage = this.maxStage - 1; // Reset to stage 3
            this.updateMesh();
            return this.getFruitName();
        }
        return super.harvest(); // Chop down if not fruiting or if user wants wood (logic depends on tool, but here we simplify)
    }

    abstract getFruitName(): string;
    abstract getFruitColor(): number;

    updateMesh() {
        this.mesh.clear();

        // Trunk
        const trunkHeight = 1.5;
        const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, trunkHeight);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4A3C31 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = trunkHeight / 2;
        this.mesh.add(trunk);

        // Foliage
        const foliageSize = 1.2;
        const foliageGeo = new THREE.DodecahedronGeometry(foliageSize);
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.y = trunkHeight + (foliageSize / 2) - 0.2;
        this.mesh.add(foliage);

        // Fruits
        if (this.currentStage === this.maxStage) {
            const fruitGeo = new THREE.SphereGeometry(0.15);
            const fruitMat = new THREE.MeshStandardMaterial({ color: this.getFruitColor() });

            const positions = [
                [0.5, 0.5, 0.5],
                [-0.5, 0.6, -0.5],
                [0.4, 0.2, -0.4],
                [-0.3, 0.7, 0.4]
            ];

            positions.forEach(pos => {
                const fruit = new THREE.Mesh(fruitGeo, fruitMat);
                fruit.position.set(pos[0], trunkHeight + foliageSize / 2 + pos[1], pos[2]);
                this.mesh.add(fruit);
            });
        }
    }
}
