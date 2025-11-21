import { GameObject } from './GameObject';

export abstract class GrowableObject extends GameObject {
    public growthStage: number = 0;
    public timer: number = 0;
    public abstract maxGrowthStage: number;
    public abstract growthTime: number;

    update(deltaTime: number) {
        if (this.growthStage >= this.maxGrowthStage) return;

        this.timer += deltaTime;

        if (this.timer >= this.growthTime) {
            this.timer = 0;
            this.grow();
        }
    }

    grow() {
        this.growthStage++;
        this.updateVisuals();
    }

    updateVisuals() {
        const [x, , z] = this.mesh.position.toArray();
        this.scene.remove(this.mesh);
        this.disposeObject(this.mesh);

        this.mesh = this.createMesh();
        this.mesh.position.set(x, this.position.y, z);

        // Re-apply user data
        this.mesh.userData = {
            isGameObject: true,
            id: this.id,
            type: this.constructor.name
        };

        this.scene.add(this.mesh);
    }
}
