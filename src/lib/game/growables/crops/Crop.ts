import { GrowableObject } from '../GrowableObject';

export abstract class Crop extends GrowableObject {
    constructor(x: number, z: number, maxStage: number, growthDuration: number) {
        super(x, z, maxStage, growthDuration);
        this.mesh.position.y = 0.1;
    }

    harvest() {
        // Logic to remove object is handled by the scene manager usually,
        // but we can mark it as harvested or return true.
        // For now, let's assume the scene calls this and then removes it.
        return true;
    }
}
