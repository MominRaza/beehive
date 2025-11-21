import * as THREE from 'three';
import { Tree } from './objects/trees/Tree';
import { OakTree } from './objects/trees/OakTree';
import { PineTree } from './objects/trees/PineTree';
import type { TreeType } from './types';
import { GrowableManager } from './GrowableManager';

export class TreeManager extends GrowableManager<Tree> {
    get trees() { return this.objects; }

    create(x: number, z: number, type: TreeType = "oak") {
        this.createTree(x, z, type);
    }

    createTree(x: number, z: number, type: TreeType = "oak") {
        const key = `${x},${z}`;

        // Check if tree already exists
        if (this.objects.has(key)) {
            return;
        }

        let tree: Tree;
        if (type === "pine") {
            tree = new PineTree(this.scene, x, z);
        } else {
            tree = new OakTree(this.scene, x, z);
        }

        this.objects.set(key, tree);
    }

    harvest(x: number, z: number): boolean {
        const key = `${x},${z}`;
        const tree = this.objects.get(key);

        if (tree && tree.growthStage >= tree.maxGrowthStage) {
            this.remove(x, z);
            return true;
        }
        return false;
    }
}
