import * as THREE from 'three';
import { GROWTH_TIMES, type CropType } from './types';

export class CropManager {
    private scene: THREE.Scene;
    public crops = new Map<string, { mesh: THREE.Mesh; type: CropType; growthStage: number; timer: number }>();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    createCrop(x: number, z: number, type: CropType) {
        const key = `${x},${z}`;

        // Check if crop already exists
        if (this.crops.has(key)) {
            return;
        }

        // Initial stage 0 (Sprout)
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green sprout
        const crop = new THREE.Mesh(geometry, material);

        // Dirt height is 0.1, so place crop on top
        // Crop height is 0.2, so center is at 0.1 + 0.1 = 0.2
        crop.position.set(x, 0.2, z);

        this.scene.add(crop);
        this.crops.set(key, { mesh: crop, type, growthStage: 0, timer: 0 });
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

    updateVisuals(data: { mesh: THREE.Mesh; type: CropType; growthStage: number }) {
        const { mesh, type, growthStage } = data;
        const [x, , z] = mesh.position.toArray();

        this.scene.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();

        let geometry: THREE.BoxGeometry;
        let material: THREE.MeshStandardMaterial;
        let posY: number;

        if (growthStage === 1) {
            // Stage 1: Taller green stalk
            geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
            material = new THREE.MeshStandardMaterial({ color: 0x32cd32 }); // Lime Green
            posY = 0.1 + 0.2; // 0.3
        } else {
            // Stage 2: Fully grown (Final Color)
            let color = 0xffff00; // Wheat
            if (type === "carrot") color = 0xffa500; // Orange
            if (type === "tomato") color = 0xff6347; // Tomato

            geometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
            material = new THREE.MeshStandardMaterial({ color });
            posY = 0.1 + 0.25; // 0.35
        }

        const newMesh = new THREE.Mesh(geometry, material);
        newMesh.position.set(x, posY, z);
        this.scene.add(newMesh);
        data.mesh = newMesh;
    }

    harvest(x: number, z: number): CropType | null {
        const key = `${x},${z}`;
        const cropData = this.crops.get(key);

        if (cropData && cropData.growthStage >= 2) {
            const type = cropData.type;
            this.scene.remove(cropData.mesh);
            cropData.mesh.geometry.dispose();
            (cropData.mesh.material as THREE.Material).dispose();
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
            existingCropData.mesh.geometry.dispose();
            (existingCropData.mesh.material as THREE.Material).dispose();
            this.crops.delete(key);
        }
    }

    dispose() {
        this.crops.forEach((data) => {
            this.scene.remove(data.mesh);
            data.mesh.geometry.dispose();
            (data.mesh.material as THREE.Material).dispose();
        });
        this.crops.clear();
    }
}
