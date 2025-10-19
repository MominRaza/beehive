import type * as THREE from "three";
import type {
    FarmTile,
    GameState,
    Placeable,
    Tree,
} from "../../stores/farm";
import {
    createBuildingModel,
    createCropModel,
    createFarmTile,
    createTreeModel,
} from "../models";

export interface TileCacheEntry {
    mesh: THREE.Group;
    isPlowed: boolean;
}

export interface CropCacheEntry {
    mesh: THREE.Group;
    type: string;
    stageBucket: number;
}

export interface PlaceableCacheEntry {
    mesh: THREE.Group;
    type: string;
    stageBucket: number;
}

export interface TerrainCaches {
    tileCache: Map<string, TileCacheEntry>;
    cropCache: Map<string, CropCacheEntry>;
    placeableCache: Map<string, PlaceableCacheEntry>;
}

export interface TerrainSyncContext {
    scene: THREE.Scene;
    state: GameState;
    tileObjects: Map<number, THREE.Object3D>;
    placeableObjects: Map<number, THREE.Object3D>;
    caches: TerrainCaches;
}

export function tileKey(tile: FarmTile): string {
    return `${tile.x}:${tile.z}`;
}

export function placeableKey(placeable: Placeable): string {
    return `${placeable.type}:${placeable.x}:${placeable.z}`;
}

export function syncTerrain(context: TerrainSyncContext): void {
    const { scene, state, tileObjects, placeableObjects, caches } = context;
    const { tileCache, cropCache, placeableCache } = caches;

    tileObjects.clear();
    const nextTileKeys = new Set<string>();

    state.tiles.forEach((tile, index) => {
        const key = tileKey(tile);
        if (tile.isLocked) {
            removeAndDelete(scene, tileCache, key);
            removeAndDelete(scene, cropCache, key);
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
                const mesh = createCropModel(tile.crop.type, tile.crop.growthProgress);
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

    removeUnusedEntries(scene, tileCache, nextTileKeys);
    removeUnusedEntries(scene, cropCache, nextTileKeys);

    placeableObjects.clear();
    const nextPlaceableKeys = new Set<string>();

    state.placeables.forEach((placeable, index) => {
        const key = placeableKey(placeable);
        nextPlaceableKeys.add(key);

        const stageBucket =
            placeable.type === "tree" && placeable.data
                ? quantizeStage((placeable.data as Tree).growthProgress)
                : 0;

        const existing = placeableCache.get(key);
        const needsNew =
            !existing ||
            existing.type !== placeable.type ||
            existing.stageBucket !== stageBucket;

        if (needsNew) {
            if (existing) {
                scene.remove(existing.mesh);
            }
            const mesh = createPlaceableMesh(placeable);
            if (!mesh) {
                placeableCache.delete(key);
                return;
            }

            mesh.position.set(placeable.x, 0, placeable.z);
            scene.add(mesh);
            placeableCache.set(key, {
                mesh,
                type: placeable.type,
                stageBucket,
            });
        }

        const current = placeableCache.get(key);
        if (!current) {
            return;
        }

        current.mesh.position.set(placeable.x, 0, placeable.z);
        placeableObjects.set(index, current.mesh);
    });

    removeUnusedEntries(scene, placeableCache, nextPlaceableKeys);
}

function createPlaceableMesh(placeable: Placeable): THREE.Group | null {
    if (placeable.type === "tree" && placeable.data) {
        const tree = placeable.data as Tree;
        return createTreeModel(tree.type, tree.growthProgress);
    }

    if (placeable.type === "building" && placeable.data) {
        const building = placeable.data as { type: string };
        return createBuildingModel(building.type);
    }

    if (placeable.type === "well") {
        return createBuildingModel("well");
    }

    return null;
}

function quantizeStage(progress: number): number {
    return Math.round(progress * 12);
}

function removeUnusedEntries<T extends { mesh: THREE.Object3D }>(
    scene: THREE.Scene,
    cache: Map<string, T>,
    keysToKeep: Set<string>,
): void {
    for (const key of Array.from(cache.keys())) {
        if (!keysToKeep.has(key)) {
            const entry = cache.get(key);
            if (entry) {
                scene.remove(entry.mesh);
                cache.delete(key);
            }
        }
    }
}

function removeAndDelete<T extends { mesh: THREE.Object3D }>(
    scene: THREE.Scene,
    cache: Map<string, T>,
    key: string,
): void {
    const entry = cache.get(key);
    if (entry) {
        scene.remove(entry.mesh);
        cache.delete(key);
    }
}
