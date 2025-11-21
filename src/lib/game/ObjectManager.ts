import * as THREE from 'three';
import { GameObject } from './objects/GameObject';

export abstract class ObjectManager<T extends GameObject> {
    protected scene: THREE.Scene;
    protected group: THREE.Object3D;
    public objects = new Map<string, T>();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.group = scene; // Default to scene, can be overridden
    }

    abstract create(x: number, z: number, type?: string): void;

    get(x: number, z: number): T | undefined {
        return this.objects.get(`${x},${z}`);
    }

    remove(x: number, z: number) {
        const key = `${x},${z}`;
        if (this.objects.has(key)) {
            const obj = this.objects.get(key)!;
            obj.dispose();
            this.objects.delete(key);
        }
    }

    dispose() {
        this.objects.forEach((obj) => {
            obj.dispose();
        });
        this.objects.clear();
    }
}
