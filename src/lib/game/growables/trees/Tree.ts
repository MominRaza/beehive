import { GrowableObject } from '../GrowableObject';

export abstract class Tree extends GrowableObject {
    constructor(x: number, z: number, maxStage: number, growthDuration: number) {
        super(x, z, maxStage, growthDuration);
        // Trees are larger, maybe scale or position offset
    }

    harvest() {
        // Requires Axe
        return "wood";
    }
}
