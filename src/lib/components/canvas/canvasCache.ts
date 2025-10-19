import * as THREE from 'three';
import type { FarmTile, Placeable } from '../../stores/farmTypes';

export interface CacheEntry {
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

/**
 * Create a key for a tile
 */
export function tileKey(tile: FarmTile): string {
    return `${tile.x}:${tile.z}`;
}

/**
 * Create a key for a placeable
 */
export function placeableKey(placeable: Placeable): string {
    return `${placeable.type}:${placeable.x}:${placeable.z}`;
}

/**
 * Quantize stage to reduce cache misses
 */
export function quantizeStage(progress: number): number {
    return Math.round(progress * 12);
}

/**
 * Clear all cached objects from scene
 */
export function clearAllCaches(
    scene: THREE.Scene,
    tileCache: Map<string, CacheEntry>,
    cropCache: Map<string, CropCacheEntry>,
    placeableCache: Map<string, PlaceableCacheEntry>,
    chunkCache: Map<string, any>,
    fenceCache: Map<string, THREE.Group>,
    selectionHighlight: THREE.Mesh | null
): void {
    for (const entry of tileCache.values()) {
        scene.remove(entry.mesh);
    }
    tileCache.clear();

    for (const entry of cropCache.values()) {
        scene.remove(entry.mesh);
    }
    cropCache.clear();

    for (const entry of placeableCache.values()) {
        scene.remove(entry.mesh);
    }
    placeableCache.clear();

    for (const entry of chunkCache.values()) {
        scene.remove(entry.group);
    }
    chunkCache.clear();

    for (const fence of fenceCache.values()) {
        scene.remove(fence);
    }
    fenceCache.clear();

    if (selectionHighlight) {
        scene.remove(selectionHighlight);
    }
}
