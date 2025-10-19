import * as THREE from 'three';

/**
 * Camera controls for pan and zoom
 */
export interface CameraControls {
    handleWheel: (event: WheelEvent, camera: THREE.PerspectiveCamera) => void;
    handlePanStart: (event: MouseEvent) => void;
    handlePanMove: (event: MouseEvent, camera: THREE.PerspectiveCamera, onComplete: () => void) => void;
    handlePanEnd: (event: MouseEvent) => void;
    isPanning: () => boolean;
}

// Zoom limits
const MIN_ZOOM = 10;
const MAX_ZOOM = 40;

// Pan state
let isPanningState = false;
let lastMouseX = 0;
let lastMouseY = 0;
let cameraTargetX = 0;
let cameraTargetZ = 0;

/**
 * Handle mouse wheel for zooming
 */
function handleWheel(event: WheelEvent, camera: THREE.PerspectiveCamera): void {
    event.preventDefault();

    const zoomSpeed = 0.1;
    const delta = event.deltaY > 0 ? 1 : -1;

    const currentDistance = Math.sqrt(
        camera.position.x * camera.position.x +
        camera.position.y * camera.position.y +
        camera.position.z * camera.position.z
    );

    const newDistance = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentDistance + delta * zoomSpeed * currentDistance));
    const scale = newDistance / currentDistance;

    camera.position.multiplyScalar(scale);
}

/**
 * Handle mouse down for panning
 */
function handlePanStart(event: MouseEvent): void {
    if (event.button === 2 || event.button === 1) { // Right or middle mouse button
        isPanningState = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        event.preventDefault();
    }
}

/**
 * Handle mouse move for panning
 */
function handlePanMove(event: MouseEvent, camera: THREE.PerspectiveCamera, onComplete: () => void): void {
    if (isPanningState) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;

        const panSpeed = 0.05;
        cameraTargetX -= deltaX * panSpeed;
        cameraTargetZ -= deltaY * panSpeed;

        camera.position.x = cameraTargetX;
        camera.position.z = cameraTargetZ + 20;
        camera.lookAt(cameraTargetX, 0, cameraTargetZ);
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;

        onComplete();
    }
}

/**
 * Handle mouse up to stop panning
 */
function handlePanEnd(event: MouseEvent): void {
    if (event.button === 2 || event.button === 1) {
        isPanningState = false;
    }
}

/**
 * Check if currently panning
 */
function isPanning(): boolean {
    return isPanningState;
}

/**
 * Create camera controls
 */
export function createCameraControls(): CameraControls {
    return {
        handleWheel,
        handlePanStart,
        handlePanMove,
        handlePanEnd,
        isPanning,
    };
}
