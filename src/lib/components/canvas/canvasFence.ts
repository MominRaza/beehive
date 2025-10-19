import * as THREE from 'three';
import type { GameState } from '../../stores/farmTypes';
import { tileKey } from './canvasCache';

/**
 * Create a fence between tiles
 */
export function createFence(x: number, z: number, direction: number): THREE.Group {
    const group = new THREE.Group();

    const postGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.08);
    const railGeometry = new THREE.BoxGeometry(0.92, 0.05, 0.05);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    let rotation = 0;
    let offsetX = 0;
    let offsetZ = 0;

    switch (direction) {
        case 0:
            rotation = Math.PI / 2;
            offsetX = 0.5;
            break;
        case 1:
            rotation = Math.PI / 2;
            offsetX = -0.5;
            break;
        case 2:
            offsetZ = 0.5;
            break;
        case 3:
            offsetZ = -0.5;
            break;
    }

    const post1 = new THREE.Mesh(postGeometry, material);
    post1.position.set(x + offsetX - 0.4, 0.2, z + offsetZ);
    if (rotation) post1.rotation.y = rotation;
    group.add(post1);

    const post2 = new THREE.Mesh(postGeometry, material);
    post2.position.set(x + offsetX + 0.4, 0.2, z + offsetZ);
    if (rotation) post2.rotation.y = rotation;
    group.add(post2);

    const rail1 = new THREE.Mesh(railGeometry, material);
    rail1.position.set(x + offsetX, 0.15, z + offsetZ);
    if (rotation) rail1.rotation.y = rotation;
    group.add(rail1);

    const rail2 = new THREE.Mesh(railGeometry, material);
    rail2.position.set(x + offsetX, 0.3, z + offsetZ);
    if (rotation) rail2.rotation.y = rotation;
    group.add(rail2);

    return group;
}

/**
 * Update fences around unlocked tiles
 */
export function updateFences(
    state: GameState,
    scene: THREE.Scene,
    fenceCache: Map<string, THREE.Group>
): void {
    const neededKeys = new Set<string>();

    const unlocked = state.tiles.filter((tile) => !tile.isLocked);
    const unlockedSet = new Set(unlocked.map((tile) => tileKey(tile)));

    unlocked.forEach((tile) => {
        const neighbors = [
            { x: tile.x + 1, z: tile.z, dir: 0 },
            { x: tile.x - 1, z: tile.z, dir: 1 },
            { x: tile.x, z: tile.z + 1, dir: 2 },
            { x: tile.x, z: tile.z - 1, dir: 3 },
        ];

        neighbors.forEach((neighbor) => {
            const neighborKey = `${neighbor.x}:${neighbor.z}`;
            if (!unlockedSet.has(neighborKey)) {
                const fenceKey = `${tile.x}:${tile.z}:${neighbor.dir}`;
                neededKeys.add(fenceKey);

                if (!fenceCache.has(fenceKey)) {
                    const fence = createFence(tile.x, tile.z, neighbor.dir);
                    scene.add(fence);
                    fenceCache.set(fenceKey, fence);
                }
            }
        });
    });

    for (const key of Array.from(fenceCache.keys())) {
        if (!neededKeys.has(key)) {
            const fence = fenceCache.get(key);
            if (fence) {
                scene.remove(fence);
                fenceCache.delete(key);
            }
        }
    }
}
