import * as THREE from 'three';
import { get } from 'svelte/store';
import {
    gameState,
    selectTile,
    plowTile,
    plantCrop,
    harvestCrop,
    placeTree,
    placeBuilding,
    harvestTree,
    chopTree,
    selectChunkForPurchase,
} from '../../stores/farm';
import { isCropReadyToHarvest } from '../farming';
import { createCameraControls } from './inputCamera';
import { createRaycastUtils } from './inputRaycast';

export interface InputHandler {
    handleClick: (event: MouseEvent) => void;
    handleMouseMove: (event: MouseEvent) => void;
    handleWheel: (event: WheelEvent) => void;
    handleMouseDown: (event: MouseEvent) => void;
    handleMouseUp: (event: MouseEvent) => void;
    cleanup: () => void;
}

/**
 * Create input handler for the game with zoom and pan
 */
export function createInputHandler(
    canvas: HTMLCanvasElement,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    tileObjects: Map<number, THREE.Object3D>,
    placeableObjects: Map<number, THREE.Object3D>,
    chunkObjects: Map<string, THREE.Object3D>,
    onTileHover: (tileIndex: number | null) => void,
    onChunkHover: (chunkId: string | null) => void
): InputHandler {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const cameraControls = createCameraControls();
    const raycastUtils = createRaycastUtils();

    /**
     * Handle mouse wheel for zooming
     */
    function handleWheel(event: WheelEvent): void {
        cameraControls.handleWheel(event, camera);
    }

    /**
     * Handle mouse down for panning
     */
    function handleMouseDown(event: MouseEvent): void {
        cameraControls.handlePanStart(event);
    }

    /**
     * Handle mouse up to stop panning
     */
    function handleMouseUp(event: MouseEvent): void {
        cameraControls.handlePanEnd(event);
    }

    /**
     * Handle mouse move for tile hovering and panning
     */
    function handleMouseMove(event: MouseEvent): void {
        if (cameraControls.isPanning()) {
            cameraControls.handlePanMove(event, camera, () => {
                onTileHover(null);
                onChunkHover(null);
            });
        } else {
            raycastUtils.updateMousePosition(event, canvas, mouse);
            const chunkId = raycastUtils.raycastChunks(raycaster, mouse, camera, chunkObjects);
            onChunkHover(chunkId);

            if (chunkId !== null) {
                onTileHover(null);
                return;
            }

            const tileIndex = raycastUtils.raycastTiles(raycaster, mouse, camera, tileObjects);
            onTileHover(tileIndex);
        }
    }

    /**
     * Handle click for tile interaction
     */
    function handleClick(event: MouseEvent): void {
        if (cameraControls.isPanning()) return; // Ignore clicks while panning

        raycastUtils.updateMousePosition(event, canvas, mouse);
        const state = get(gameState);

        // Check placeables first
        const placeableIndex = raycastUtils.raycastPlaceables(raycaster, mouse, camera, placeableObjects);
        if (placeableIndex !== null) {
            const placeable = state.placeables[placeableIndex];

            if (placeable.type === 'tree') {
                if (state.selectedTool === 'axe') {
                    chopTree(placeableIndex);
                } else {
                    harvestTree(placeableIndex);
                }
            }
            selectChunkForPurchase(null);
            return;
        }

        const chunkId = raycastUtils.raycastChunks(raycaster, mouse, camera, chunkObjects);
        if (chunkId !== null) {
            const chunk = state.chunks.find((c) => c.id === chunkId);
            if (chunk && !chunk.isOwned) {
                selectChunkForPurchase(chunkId);
            } else {
                selectChunkForPurchase(null);
            }
            selectTile(null);
            onTileHover(null);
            return;
        }

        // Check tiles
        const tileIndex = raycastUtils.raycastTiles(raycaster, mouse, camera, tileObjects);

        if (tileIndex === null) {
            selectTile(null);
            selectChunkForPurchase(null);
            return;
        }

        const tile = state.tiles[tileIndex];
        if (!tile) return;

        selectTile(tileIndex);
        selectChunkForPurchase(null);

        // Handle placing trees or buildings
        if (state.selectedTree) {
            // Find empty spot near tile
            placeTree(tile.x, tile.z, state.selectedTree);
            return;
        }

        if (state.selectedBuilding) {
            placeBuilding(tile.x, tile.z, state.selectedBuilding);
            return;
        }

        // Handle tool actions
        if (state.selectedTool) {
            switch (state.selectedTool) {
                case 'hoe':
                    if (!tile.isPlowed && !tile.crop && !tile.isLocked) {
                        plowTile(tileIndex);
                    }
                    break;

                case 'scythe':
                    if (tile.crop && state.ownedTools.includes('scythe')) {
                        // Instant harvest with scythe
                        if (tile.crop.growthProgress >= 0.5) {
                            // Can harvest at 50% with scythe
                            harvestCrop(tileIndex);
                        }
                    }
                    break;

                case 'watering_can':
                    // Watering can provides passive bonus, no direct action needed
                    break;
            }
        }

        // Handle seed planting
        if (state.selectedSeed && tile.isPlowed && !tile.crop && !tile.isLocked) {
            plantCrop(tileIndex, state.selectedSeed);
        }

        // Handle crop harvesting (click on mature crop)
        if (!state.selectedSeed && !state.selectedTool && tile.crop) {
            if (isCropReadyToHarvest(tile.crop.growthProgress)) {
                harvestCrop(tileIndex);
            }
        }
    }

    // Attach event listeners
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent right-click menu

    // Return handler with cleanup
    return {
        handleClick,
        handleMouseMove,
        handleWheel,
        handleMouseDown,
        handleMouseUp,
        cleanup: () => {
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mouseup', handleMouseUp);
        },
    };
}

// Re-export for convenience
export { getCursorStyle } from './inputRaycast';
