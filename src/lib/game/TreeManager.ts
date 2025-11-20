import * as THREE from 'three';
import { GROWTH_TIMES } from './types';

export class TreeManager {
    private scene: THREE.Scene;
    public trees = new Map<string, { mesh: THREE.Group; growthStage: number; timer: number }>();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    createTree(x: number, z: number) {
        const key = `${x},${z}`;

        // Check if tree already exists
        if (this.trees.has(key)) {
            return;
        }

        // Initial stage 0 (Sapling)
        const group = new THREE.Group();

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.1; // Half height
        group.add(trunk);

        // Leaves
        const leavesGeo = new THREE.SphereGeometry(0.15);
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = 0.2;
        group.add(leaves);

        // Grass height is 0.3, so place tree on top
        group.position.set(x, 0.3, z);

        this.scene.add(group);
        this.trees.set(key, { mesh: group, growthStage: 0, timer: 0 });
    }

    update(deltaTime: number) {
        this.trees.forEach((data) => {
            if (data.growthStage >= 2) return; // Fully grown

            data.timer += deltaTime;
            const growthTime = GROWTH_TIMES["tree"];

            if (data.timer >= growthTime) {
                data.timer = 0;
                data.growthStage++;
                this.updateVisuals(data);
            }
        });
    }

    updateVisuals(data: { mesh: THREE.Group; growthStage: number }) {
        const { mesh, growthStage } = data;
        const [x, , z] = mesh.position.toArray();

        this.scene.remove(mesh);
        // Dispose old
        mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                (child.material as THREE.Material).dispose();
            }
        });

        const group = new THREE.Group();
        let trunkHeight = 0.2;
        let trunkRadius = 0.05;
        let leavesRadius = 0.15;
        let leavesY = 0.2;

        if (growthStage === 1) {
            // Small Tree
            trunkHeight = 0.5;
            trunkRadius = 0.1;
            leavesRadius = 0.3;
            leavesY = 0.5;
        } else {
            // Big Tree
            trunkHeight = 1.0;
            trunkRadius = 0.15;
            leavesRadius = 0.5;
            leavesY = 1.0;
        }

        const trunkGeo = new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = trunkHeight / 2;
        group.add(trunk);

        const leavesGeo = new THREE.SphereGeometry(leavesRadius);
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = leavesY;
        group.add(leaves);

        group.position.set(x, 0.3, z);
        this.scene.add(group);
        data.mesh = group;
    }

    harvest(x: number, z: number): boolean {
        const key = `${x},${z}`;
        const treeData = this.trees.get(key);

        if (treeData && treeData.growthStage >= 2) {
            this.remove(x, z);
            return true;
        }
        return false;
    }

    remove(x: number, z: number) {
        const key = `${x},${z}`;
        if (this.trees.has(key)) {
            const existingTreeData = this.trees.get(key)!;
            this.scene.remove(existingTreeData.mesh);
            // Dispose group children
            existingTreeData.mesh.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    (child.material as THREE.Material).dispose();
                }
            });
            this.trees.delete(key);
        }
    }

    dispose() {
        this.trees.forEach((data) => {
            this.scene.remove(data.mesh);
            data.mesh.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    (child.material as THREE.Material).dispose();
                }
            });
        });
        this.trees.clear();
    }
}
