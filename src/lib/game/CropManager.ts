import * as THREE from 'three';
import { GROWTH_TIMES, type CropType, SURFACE_HEIGHTS } from './types';

export class CropManager {
    private scene: THREE.Scene;
    public crops = new Map<string, { mesh: THREE.Object3D; type: CropType; growthStage: number; timer: number }>();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    createCrop(x: number, z: number, type: CropType) {
        const key = `${x},${z}`;

        // Check if crop already exists
        if (this.crops.has(key)) {
            return;
        }

        const cropVisual = this.createCropVisual(type, 0);
        cropVisual.position.set(x, SURFACE_HEIGHTS.DIRT, z); // Sit on top of dirt

        this.scene.add(cropVisual);
        this.crops.set(key, { mesh: cropVisual, type, growthStage: 0, timer: 0 });
    }

    update(deltaTime: number) {
        this.crops.forEach((data) => {
            if (data.growthStage >= 2) return; // Fully grown

            data.timer += deltaTime;
            const growthTime = GROWTH_TIMES[data.type] || 2;

            if (data.timer >= growthTime) {
                data.timer = 0;
                data.growthStage++;
                this.updateVisuals(data);
            }
        });
    }

    updateVisuals(data: { mesh: THREE.Object3D; type: CropType; growthStage: number }) {
        const { mesh, type, growthStage } = data;
        const [x, , z] = mesh.position.toArray();

        this.scene.remove(mesh);
        this.disposeObject(mesh);

        const newMesh = this.createCropVisual(type, growthStage);
        newMesh.position.set(x, SURFACE_HEIGHTS.DIRT, z);

        this.scene.add(newMesh);
        data.mesh = newMesh;
    }

    private createCropVisual(type: CropType, stage: number): THREE.Object3D {
        const group = new THREE.Group();

        if (stage === 0) {
            // Sprout: 2 small leaves
            const leafGeo = new THREE.BoxGeometry(0.05, 0.1, 0.02);
            const leafMat = new THREE.MeshStandardMaterial({ color: 0x32cd32 });

            const leaf1 = new THREE.Mesh(leafGeo, leafMat);
            leaf1.position.set(0.05, 0.05, 0);
            leaf1.rotation.z = -Math.PI / 6;
            leaf1.castShadow = true;

            const leaf2 = new THREE.Mesh(leafGeo, leafMat);
            leaf2.position.set(-0.05, 0.05, 0);
            leaf2.rotation.z = Math.PI / 6;
            leaf2.castShadow = true;

            group.add(leaf1, leaf2);
        } else if (type === 'wheat') {
            this.createWheatVisual(group, stage);
        } else if (type === 'carrot') {
            this.createCarrotVisual(group, stage);
        } else if (type === 'tomato') {
            this.createTomatoVisual(group, stage);
        }

        return group;
    }

    private createWheatVisual(group: THREE.Group, stage: number) {
        const color = stage === 2 ? 0xeebb00 : 0x32cd32; // Gold or Green
        const material = new THREE.MeshStandardMaterial({ color });

        const count = stage === 1 ? 4 : 7;
        const height = stage === 1 ? 0.4 : 0.6;

        for (let i = 0; i < count; i++) {
            const stalk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, height),
                material
            );
            // Randomize slightly
            const angle = (i / count) * Math.PI * 2 + Math.random();
            const radius = 0.15 * Math.random();
            stalk.position.set(Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius);
            stalk.rotation.x = (Math.random() - 0.5) * 0.3;
            stalk.rotation.z = (Math.random() - 0.5) * 0.3;
            stalk.castShadow = true;
            group.add(stalk);

            // Wheat head (only for stage 2)
            if (stage === 2) {
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.04, 0.15, 0.04),
                    material
                );
                head.position.y = height / 2 + 0.075;
                stalk.add(head);
            }
        }
    }

    private createCarrotVisual(group: THREE.Group, stage: number) {
        // Leaves
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leafCount = stage === 1 ? 3 : 5;

        for (let i = 0; i < leafCount; i++) {
            const leaf = new THREE.Mesh(
                new THREE.ConeGeometry(0.05, 0.3, 4),
                leafMat
            );
            leaf.position.y = 0.15;
            leaf.rotation.x = (Math.random() - 0.5) * 1;
            leaf.rotation.z = (Math.random() - 0.5) * 1;
            leaf.castShadow = true;
            group.add(leaf);
        }

        if (stage === 2) {
            // Orange top poking out
            const carrotMat = new THREE.MeshStandardMaterial({ color: 0xffa500 });
            const carrotTop = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 0.1),
                carrotMat
            );
            carrotTop.position.y = 0.05;
            carrotTop.castShadow = true;
            group.add(carrotTop);
        }
    }

    private createTomatoVisual(group: THREE.Group, stage: number) {
        // Bush
        const bushMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });

        // Main stem
        const mainStem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.5),
            bushMat
        );
        mainStem.position.y = 0.25;
        mainStem.castShadow = true;
        group.add(mainStem);

        // Leaves/Branches
        const branchCount = stage === 1 ? 3 : 6;
        for (let i = 0; i < branchCount; i++) {
            const branch = new THREE.Mesh(
                new THREE.BoxGeometry(0.25, 0.02, 0.02),
                bushMat
            );
            branch.position.y = 0.1 + Math.random() * 0.3;
            branch.rotation.y = Math.random() * Math.PI;
            branch.rotation.z = (Math.random() - 0.5) * 0.5;
            branch.castShadow = true;
            group.add(branch);
        }

        if (stage === 2) {
            // Tomatoes
            const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xff6347 });
            const positions = [
                [0.1, 0.2, 0], [-0.1, 0.3, 0.05], [0, 0.4, -0.1], [0.05, 0.15, -0.05]
            ];

            positions.forEach(pos => {
                const tomato = new THREE.Mesh(
                    new THREE.SphereGeometry(0.06, 8, 8),
                    tomatoMat
                );
                tomato.position.set(pos[0], pos[1], pos[2]);
                tomato.castShadow = true;
                group.add(tomato);
            });
        }
    }

    harvest(x: number, z: number): CropType | null {
        const key = `${x},${z}`;
        const cropData = this.crops.get(key);

        if (cropData && cropData.growthStage >= 2) {
            const type = cropData.type;
            this.scene.remove(cropData.mesh);
            this.disposeObject(cropData.mesh);
            this.crops.delete(key);
            return type;
        }
        return null;
    }

    remove(x: number, z: number) {
        const key = `${x},${z}`;
        if (this.crops.has(key)) {
            const existingCropData = this.crops.get(key)!;
            this.scene.remove(existingCropData.mesh);
            this.disposeObject(existingCropData.mesh);
            this.crops.delete(key);
        }
    }

    private disposeObject(obj: THREE.Object3D) {
        obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }

    dispose() {
        this.crops.forEach((data) => {
            this.scene.remove(data.mesh);
            this.disposeObject(data.mesh);
        });
        this.crops.clear();
    }
}
