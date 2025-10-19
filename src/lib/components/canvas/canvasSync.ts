import * as THREE from 'three';
import type { GameState, Tree } from '../../stores/farmTypes';
import { createFarmTile, createCropModel, createTreeModel, createBuildingModel } from '../../systems/models';
import { tileKey, placeableKey, quantizeStage, type CacheEntry, type CropCacheEntry, type PlaceableCacheEntry } from './canvasCache';

/**
 * Sync tiles with the scene
 */
export function syncTiles(
    state: GameState,
    scene: THREE.Scene,
    tileObjects: Map<number, THREE.Object3D>,
    tileCache: Map<string, CacheEntry>,
    cropCache: Map<string, CropCacheEntry>
): void {
    tileObjects.clear();
    const nextTileKeys = new Set<string>();

    state.tiles.forEach((tile, index) => {
        const key = tileKey(tile);
        if (tile.isLocked) {
            if (tileCache.has(key)) {
                const cachedTile = tileCache.get(key)!;
                scene.remove(cachedTile.mesh);
                tileCache.delete(key);
            }
            if (cropCache.has(key)) {
                const cachedCrop = cropCache.get(key)!;
                scene.remove(cachedCrop.mesh);
                cropCache.delete(key);
            }
            tileObjects.delete(index);
            return;
        }

        nextTileKeys.add(key);

        let tileEntry = tileCache.get(key);
        if (!tileEntry || tileEntry.isPlowed !== tile.isPlowed) {
            if (tileEntry) {
                scene.remove(tileEntry.mesh);
            }
            const mesh = createFarmTile(tile.x, tile.z, tile.isPlowed);
            scene.add(mesh);
            tileEntry = { mesh, isPlowed: tile.isPlowed };
            tileCache.set(key, tileEntry);
        } else {
            tileEntry.mesh.position.set(tile.x, 0, tile.z);
            tileEntry.isPlowed = tile.isPlowed;
        }
        tileObjects.set(index, tileEntry.mesh);

        if (tile.crop) {
            const stageBucket = quantizeStage(tile.crop.growthProgress);
            const cached = cropCache.get(key);
            const needsNew =
                !cached ||
                cached.type !== tile.crop.type ||
                cached.stageBucket !== stageBucket;

            if (needsNew) {
                if (cached) {
                    scene.remove(cached.mesh);
                }
                const mesh = createCropModel(
                    tile.crop.type,
                    tile.crop.growthProgress,
                );
                mesh.position.set(tile.x, 0.1, tile.z);
                scene.add(mesh);
                cropCache.set(key, {
                    mesh,
                    type: tile.crop.type,
                    stageBucket,
                });
            } else {
                cached.mesh.position.set(tile.x, 0.1, tile.z);
            }
        } else if (cropCache.has(key)) {
            const cached = cropCache.get(key)!;
            scene.remove(cached.mesh);
            cropCache.delete(key);
        }
    });

    for (const key of Array.from(tileCache.keys())) {
        if (!nextTileKeys.has(key)) {
            const entry = tileCache.get(key);
            if (entry) {
                scene.remove(entry.mesh);
                tileCache.delete(key);
            }
        }
    }
    for (const key of Array.from(cropCache.keys())) {
        if (!nextTileKeys.has(key)) {
            const entry = cropCache.get(key);
            if (entry) {
                scene.remove(entry.mesh);
                cropCache.delete(key);
            }
        }
    }
}

/**
 * Sync placeables (trees and buildings) with the scene
 */
export function syncPlaceables(
    state: GameState,
    scene: THREE.Scene,
    placeableObjects: Map<number, THREE.Object3D>,
    placeableCache: Map<string, PlaceableCacheEntry>
): void {
    placeableObjects.clear();
    const nextPlaceableKeys = new Set<string>();

    state.placeables.forEach((placeable, index) => {
        const key = placeableKey(placeable);
        nextPlaceableKeys.add(key);

        const stageBucket =
            placeable.type === 'tree' && placeable.data
                ? quantizeStage((placeable.data as Tree).growthProgress)
                : 0;

        let cached = placeableCache.get(key);
        const needsNew =
            !cached ||
            cached.type !== placeable.type ||
            cached.stageBucket !== stageBucket;

        if (needsNew) {
            if (cached) {
                scene.remove(cached.mesh);
            }

            let mesh: THREE.Group | null = null;
            if (placeable.type === 'tree' && placeable.data) {
                const tree = placeable.data as Tree;
                mesh = createTreeModel(tree.type, tree.growthProgress);
            } else if (placeable.type === 'building' && placeable.data) {
                const building = placeable.data as { type: string };
                mesh = createBuildingModel(building.type);
            } else if (placeable.type === 'well') {
                mesh = createBuildingModel('well');
            }

            if (mesh) {
                mesh.position.set(placeable.x, 0, placeable.z);
                scene.add(mesh);
                placeableCache.set(key, {
                    mesh,
                    type: placeable.type,
                    stageBucket,
                });
                cached = placeableCache.get(key)!;
            } else {
                placeableCache.delete(key);
                return;
            }
        } else if (cached) {
            cached.mesh.position.set(placeable.x, 0, placeable.z);
        }

        placeableObjects.set(index, placeableCache.get(key)!.mesh);
    });

    for (const key of Array.from(placeableCache.keys())) {
        if (!nextPlaceableKeys.has(key)) {
            const entry = placeableCache.get(key);
            if (entry) {
                scene.remove(entry.mesh);
                placeableCache.delete(key);
            }
        }
    }
}
