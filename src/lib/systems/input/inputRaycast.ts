import * as THREE from 'three';
import { get } from 'svelte/store';
import { gameState } from '../../stores/farm';

/**
 * Raycasting utilities for tile and object interaction
 */
export interface RaycastUtils {
    updateMousePosition: (event: MouseEvent, canvas: HTMLCanvasElement, mouse: THREE.Vector2) => void;
    raycastTiles: (
        raycaster: THREE.Raycaster,
        mouse: THREE.Vector2,
        camera: THREE.PerspectiveCamera,
        tileObjects: Map<number, THREE.Object3D>
    ) => number | null;
    raycastPlaceables: (
        raycaster: THREE.Raycaster,
        mouse: THREE.Vector2,
        camera: THREE.PerspectiveCamera,
        placeableObjects: Map<number, THREE.Object3D>
    ) => number | null;
    raycastChunks: (
        raycaster: THREE.Raycaster,
        mouse: THREE.Vector2,
        camera: THREE.PerspectiveCamera,
        chunkObjects: Map<string, THREE.Object3D>
    ) => string | null;
}

/**
 * Update mouse position for raycasting
 */
function updateMousePosition(event: MouseEvent, canvas: HTMLCanvasElement, mouse: THREE.Vector2): void {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

/**
 * Perform raycast and return intersected tile
 */
function raycastTiles(
    raycaster: THREE.Raycaster,
    mouse: THREE.Vector2,
    camera: THREE.PerspectiveCamera,
    tileObjects: Map<number, THREE.Object3D>
): number | null {
    raycaster.setFromCamera(mouse, camera);

    const tileArray = Array.from(tileObjects.values());
    const intersects = raycaster.intersectObjects(tileArray, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        // Find the tile index for this object
        for (const [index, tileObject] of tileObjects.entries()) {
            if (tileObject === intersectedObject || tileObject.children.includes(intersectedObject)) {
                return index;
            }
        }
    }

    return null;
}

/**
 * Perform raycast and return intersected placeable
 */
function raycastPlaceables(
    raycaster: THREE.Raycaster,
    mouse: THREE.Vector2,
    camera: THREE.PerspectiveCamera,
    placeableObjects: Map<number, THREE.Object3D>
): number | null {
    raycaster.setFromCamera(mouse, camera);

    const placeableArray = Array.from(placeableObjects.values());
    const intersects = raycaster.intersectObjects(placeableArray, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        for (const [index, placeableObject] of placeableObjects.entries()) {
            if (placeableObject === intersectedObject || placeableObject.children.includes(intersectedObject)) {
                return index;
            }
        }
    }

    return null;
}

/**
 * Raycast against locked chunks
 */
function raycastChunks(
    raycaster: THREE.Raycaster,
    mouse: THREE.Vector2,
    camera: THREE.PerspectiveCamera,
    chunkObjects: Map<string, THREE.Object3D>
): string | null {
    raycaster.setFromCamera(mouse, camera);

    const chunkArray = Array.from(chunkObjects.values());
    if (chunkArray.length === 0) {
        return null;
    }

    const intersects = raycaster.intersectObjects(chunkArray, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        for (const [chunkId, chunkObject] of chunkObjects.entries()) {
            if (
                chunkObject === intersectedObject ||
                (chunkObject as THREE.Object3D).children.includes(
                    intersectedObject,
                )
            ) {
                return chunkId;
            }
        }
    }

    return null;
}

/**
 * Get cursor style based on game state and hovered tile
 */
export function getCursorStyle(
    hoveredTileIndex: number | null,
    selectedSeed: string | null,
    selectedTool: string | null,
    selectedTree: string | null,
    selectedBuilding: string | null
): string {
    if (hoveredTileIndex === null) {
        return 'default';
    }

    const state = get(gameState);
    const tile = state.tiles[hoveredTileIndex];

    if (!tile) return 'default';

    // Tree/building placement cursor
    if (selectedTree || selectedBuilding) {
        return 'pointer';
    }

    // Tool cursor
    if (selectedTool === 'hoe' && !tile.isPlowed && !tile.isLocked) {
        return 'pointer';
    }

    if (selectedTool === 'scythe' && tile.crop) {
        return 'pointer';
    }

    if (selectedTool === 'axe') {
        return 'pointer';
    }

    // Seed cursor
    if (selectedSeed && tile.isPlowed && !tile.crop && !tile.isLocked) {
        return 'pointer';
    }

    // Harvest cursor
    if (!selectedSeed && !selectedTool && tile.crop) {
        const isCropReadyToHarvest = (progress: number) => progress >= 1;
        if (isCropReadyToHarvest(tile.crop.growthProgress)) {
            return 'pointer';
        }
    }

    return 'default';
}

/**
 * Create raycast utilities
 */
export function createRaycastUtils(): RaycastUtils {
    return {
        updateMousePosition,
        raycastTiles,
        raycastPlaceables,
        raycastChunks,
    };
}
