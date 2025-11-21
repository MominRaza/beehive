import * as THREE from 'three';
import type { HoverState } from './tools/Tool';

export class InputManager {
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private camera: THREE.Camera;
    private ground: THREE.Mesh;
    private hoverIndicator: THREE.Mesh;
    private scene: THREE.Scene;
    private interactables: THREE.Object3D[] = [];

    constructor(camera: THREE.Camera, ground: THREE.Mesh, scene: THREE.Scene) {
        this.camera = camera;
        this.ground = ground;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactables = [ground];

        // Hover Indicator
        const indicatorGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const indicatorMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b4513,
            transparent: true,
            opacity: 0.5,
            depthTest: false,
            depthWrite: false,
        });
        this.hoverIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        this.hoverIndicator.renderOrder = 1;
        this.hoverIndicator.visible = false;
        this.scene.add(this.hoverIndicator);
    }

    getIntersection(event: MouseEvent): THREE.Intersection | null {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactables, true);

        return intersects.length > 0 ? intersects[0] : null;
    }

    addInteractable(object: THREE.Object3D) {
        this.interactables.push(object);
    }

    updateHoverIndicator(state: HoverState) {
        this.hoverIndicator.visible = state.visible;
        if (state.visible) {
            this.hoverIndicator.position.set(state.x || 0, state.posY || 0.05, state.z || 0);
            if (state.color !== undefined) {
                (this.hoverIndicator.material as THREE.MeshBasicMaterial).color.setHex(state.color);
            }

            if (state.scale instanceof THREE.Vector3) {
                this.hoverIndicator.scale.copy(state.scale);
            } else if (typeof state.scale === 'number') {
                this.hoverIndicator.scale.set(1, state.scale, 1);
            } else {
                this.hoverIndicator.scale.set(1, 1, 1);
            }

            if (state.rotation) {
                this.hoverIndicator.rotation.copy(state.rotation);
            } else {
                this.hoverIndicator.rotation.set(0, 0, 0);
            }
        }
    }

    dispose() {
        this.scene.remove(this.hoverIndicator);
        this.hoverIndicator.geometry.dispose();
        (this.hoverIndicator.material as THREE.Material).dispose();
    }
}
