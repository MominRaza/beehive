import * as THREE from 'three';
import type { CropType } from './types';
import { Crop } from './objects/crops/Crop';
import { Wheat } from './objects/crops/Wheat';
import { Carrot } from './objects/crops/Carrot';
import { Tomato } from './objects/crops/Tomato';
import { GrowableManager } from './GrowableManager';

export class CropManager extends GrowableManager<Crop> {
    // Alias for compatibility with existing code that accesses .crops directly
    // In a full refactor, we should rename .objects to .crops or use a getter
    get crops() { return this.objects; }

    create(x: number, z: number, type: CropType) {
        this.createCrop(x, z, type);
    }

    createCrop(x: number, z: number, type: CropType) {
        const key = `${x},${z}`;

        // Check if crop already exists
        if (this.objects.has(key)) {
            return;
        }

        let crop: Crop;
        switch (type) {
            case 'wheat':
                crop = new Wheat(this.scene, x, z);
                break;
            case 'carrot':
                crop = new Carrot(this.scene, x, z);
                break;
            case 'tomato':
                crop = new Tomato(this.scene, x, z);
                break;
            default:
                return;
        }

        this.objects.set(key, crop);
    }

    harvest(x: number, z: number): CropType | null {
        const key = `${x},${z}`;
        const crop = this.objects.get(key);

        if (crop && crop.growthStage >= crop.maxGrowthStage) {
            const type = crop.type;
            this.remove(x, z);
            return type;
        }
        return null;
    }
}
