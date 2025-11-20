import * as THREE from 'three';

export class InputManager {
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private camera: THREE.Camera;
    private ground: THREE.Mesh;
    private hoverIndicator: THREE.Mesh;
    private scene: THREE.Scene;

    constructor(camera: THREE.Camera, ground: THREE.Mesh, scene: THREE.Scene) {
        this.camera = camera;
        this.ground = ground;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

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
        const intersects = this.raycaster.intersectObject(this.ground);

        return intersects.length > 0 ? intersects[0] : null;
    }

    updateHoverIndicator(x: number, z: number, visible: boolean, color?: number, scaleY?: number, posY?: number) {
        this.hoverIndicator.visible = visible;
        if (visible) {
            this.hoverIndicator.position.set(x, posY || 0.05, z);
            if (color !== undefined) {
                (this.hoverIndicator.material as THREE.MeshBasicMaterial).color.setHex(color);
            }
            if (scaleY !== undefined) {
                this.hoverIndicator.scale.y = scaleY;
            }
        }
    }

    dispose() {
        this.scene.remove(this.hoverIndicator);
        this.hoverIndicator.geometry.dispose();
        (this.hoverIndicator.material as THREE.Material).dispose();
    }
}
