import { GameObject } from '../GameObject';

export abstract class GrowableObject extends GameObject {
    public currentStage: number = 0;
    public maxStage: number;
    public growthDuration: number;
    public lastUpdateTimestamp: number;

    constructor(x: number, z: number, maxStage: number, growthDuration: number) {
        super(x, z);
        this.maxStage = maxStage;
        this.growthDuration = growthDuration;
        this.lastUpdateTimestamp = Date.now();
    }

    checkGrowth(time: number) {
        if (this.currentStage < this.maxStage) {
            if (time - this.lastUpdateTimestamp > this.growthDuration) {
                this.currentStage++;
                this.lastUpdateTimestamp = time;
                this.updateMesh();
            }
        }
    }

    update(time: number): void {
        this.checkGrowth(time);
    }

    abstract updateMesh(): void;
}
