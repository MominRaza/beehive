import { GameObject } from '../GameObject';

export abstract class GrowableObject extends GameObject {
    protected currentStage: number = 0;
    protected maxStage: number;
    private growthDuration: number;
    private lastUpdateTimestamp: number;

    constructor(x: number, z: number, maxStage: number, growthDuration: number) {
        super(x, z);
        this.maxStage = maxStage;
        this.growthDuration = growthDuration;
        this.lastUpdateTimestamp = Date.now();
    }

    private checkGrowth(time: number) {
        if (this.currentStage < this.maxStage) {
            if (time - this.lastUpdateTimestamp > this.growthDuration) {
                this.currentStage++;
                this.lastUpdateTimestamp = time;
                this.updateMesh();
            }
        }
    }

    setCurrentStage(stage: number): boolean {
        if (stage >= 0 && stage <= this.maxStage) {
            this.currentStage = stage;
            this.updateMesh();
            return true;
        }
        return false;
    }

    update(time: number): void {
        this.checkGrowth(time);
    }

    protected abstract updateMesh(): void;
}
