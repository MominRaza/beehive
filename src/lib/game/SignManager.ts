import * as THREE from 'three';
import { Sign } from './objects/Sign';
import { ObjectManager } from './ObjectManager';

export class SignManager extends ObjectManager<Sign> {
    public signsGroup: THREE.Group;

    constructor(scene: THREE.Scene) {
        super(scene);
        this.signsGroup = new THREE.Group();
        this.scene.add(this.signsGroup);
        this.group = this.signsGroup; // Override group to use signsGroup
    }

    create(x: number, z: number) {
        this.createSingleSign(x, z);
    }

    updateSigns(buyableChunks: { cx: number, cz: number }[]) {
        // Identify which signs to keep and which to remove
        const newKeys = new Set(buyableChunks.map(c => `${c.cx},${c.cz}`));

        // Remove signs that are no longer needed
        for (const [key, sign] of this.objects) {
            if (!newKeys.has(key)) {
                sign.dispose();
                this.objects.delete(key);
            }
        }

        // Add new signs
        buyableChunks.forEach(chunk => {
            const key = `${chunk.cx},${chunk.cz}`;
            if (!this.objects.has(key)) {
                const sign = new Sign(this.group, chunk.cx * 12, chunk.cz * 12);
                this.objects.set(key, sign);
            }
        });
    }

    public createSingleSign(x: number, z: number) {
        this.clear();
        const sign = new Sign(this.group, x, z);
        this.objects.set("single", sign);
    }

    dispose() {
        super.dispose();
        this.scene.remove(this.signsGroup);
    }

    clear() {
        super.dispose(); // Clears objects map and disposes them
    }
}
