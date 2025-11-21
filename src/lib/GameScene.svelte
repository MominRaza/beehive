<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { GameManager } from "./game/GameManager";
    import { InputManager } from "./game/InputManager";
    import { PersistenceManager } from "./game/PersistenceManager";
    import HUD from "./HUD.svelte";
    import ConfirmationDialog from "./ui/ConfirmationDialog.svelte";
    import type { ToolType } from "./game/types";
    import { PRICES } from "./game/types";

    const dispatch = createEventDispatcher();

    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let ground: THREE.Mesh;
    let animationId: number;
    let lastTime: number = 0;

    let gameManager: GameManager;
    let inputManager: InputManager;

    let selectedTool: ToolType = "none";
    // inventory, produceCount, maxCapacity removed as they are now in stores
    let notification: string | null = null;
    let buyLandData: { cx: number; cz: number; price: number } | null = null;

    onMount(() => {
        init();
        animate();
        window.addEventListener("resize", onWindowResize);
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("keydown", onKeyDown);
    });

    onDestroy(() => {
        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("keydown", onKeyDown);
        if (renderer) {
            renderer.dispose();
        }
        if (controls) {
            controls.dispose();
        }
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        if (gameManager) gameManager.dispose();
        if (inputManager) inputManager.dispose();
        if (renderer && renderer.domElement) {
            renderer.domElement.removeEventListener("wheel", onMouseWheel);
        }
    });

    function onMouseWheel(event: WheelEvent) {
        event.preventDefault();

        const zoomSpeed = 0.1;
        const direction = event.deltaY > 0 ? -1 : 1;
        const factor = 1 + zoomSpeed * direction;

        // 1. Get world point under mouse BEFORE zoom
        const intersect = inputManager.getIntersection(event);
        if (!intersect) {
            // Fallback to center zoom if not hovering ground
            const newZoom = camera.zoom * factor;
            camera.zoom = Math.max(
                controls.minZoom,
                Math.min(controls.maxZoom, newZoom),
            );
            camera.updateProjectionMatrix();
            return;
        }
        const pointBefore = intersect.point.clone();

        // 2. Apply Zoom
        const newZoom = camera.zoom * factor;
        const clampedZoom = Math.max(
            controls.minZoom,
            Math.min(controls.maxZoom, newZoom),
        );

        if (camera.zoom === clampedZoom) return; // No change

        camera.zoom = clampedZoom;
        camera.updateProjectionMatrix();

        // 3. Get world point under mouse AFTER zoom (it shifted because camera didn't move)
        // We need to raycast again. Since we haven't moved the camera yet, the ray from the same mouse position
        // will hit a different point on the ground plane?
        // Actually, for Orthographic, the ray origin changes but direction is same.
        // Let's use the InputManager to get the new intersection.
        const intersectAfter = inputManager.getIntersection(event);

        if (intersectAfter) {
            const pointAfter = intersectAfter.point;

            // 4. Calculate shift needed to bring pointBefore back to mouse position
            const deltaX = pointAfter.x - pointBefore.x;
            const deltaZ = pointAfter.z - pointBefore.z;

            // 5. Pan camera and target
            camera.position.x -= deltaX;
            camera.position.z -= deltaZ;
            controls.target.x -= deltaX;
            controls.target.z -= deltaZ;
            controls.update();
        }
    }

    function init() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb); // Sky blue

        // Camera
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = 10;
        camera = new THREE.OrthographicCamera(
            -viewSize * aspect,
            viewSize * aspect,
            viewSize,
            -viewSize,
            0.1,
            1000,
        );
        camera.position.set(100, 100, 100); // Moved further out
        camera.lookAt(0, 0, 0);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableRotate = false; // Disable rotation
        controls.enableZoom = false; // Disable default zoom to handle it manually
        controls.enablePan = true;
        controls.minZoom = 0.1;
        controls.maxZoom = 5;

        // Custom Zoom-to-Cursor
        renderer.domElement.addEventListener("wheel", onMouseWheel, {
            passive: false,
        });

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshBasicMaterial({
            visible: false,
        }); // Invisible for raycasting
        ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // Managers
        gameManager = new GameManager(scene);
        inputManager = new InputManager(camera, ground, scene);
        inputManager.addInteractable(gameManager.signManager.signsGroup);

        // Inventory subscription removed

        loadGame();
    }

    function saveGame() {
        if (PersistenceManager.saveGame(gameManager)) {
            notification = "Game Saved!";
        } else {
            notification = "Failed to save game.";
        }
    }

    function deleteGame() {
        PersistenceManager.deleteSave();
        notification = "Save Deleted!";
        setTimeout(() => {
            location.reload(); // Reload to reset state
        }, 1000);
    }

    function loadGame() {
        if (!PersistenceManager.loadGame(gameManager)) {
            prefillGrass();
        }
    }

    function prefillGrass() {
        // Prefill with grass (60x60 grid)
        for (let x = -30; x < 30; x++) {
            for (let z = -30; z < 30; z++) {
                gameManager.gridManager.createTile(x + 0.5, z + 0.5, "grass");
            }
        }
    }

    function animate(time: number = 0) {
        animationId = requestAnimationFrame(animate);

        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        if (controls) {
            controls.update();
        }

        if (gameManager) {
            gameManager.update(deltaTime);
        }

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        if (camera && renderer) {
            const aspect = window.innerWidth / window.innerHeight;
            const viewSize = 10;

            camera.left = -viewSize * aspect;
            camera.right = viewSize * aspect;
            camera.top = viewSize;
            camera.bottom = -viewSize;

            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    function onPointerDown(event: MouseEvent) {
        // Only allow left click (button 0)
        if (event.button !== 0) return;

        // Only allow interaction if clicking on the canvas (not HUD)
        if (event.target !== renderer.domElement) return;

        const intersect = inputManager.getIntersection(event);

        if (intersect) {
            const point = intersect.point;

            // Snap to grid (assuming 1x1 tiles)
            const x = Math.floor(point.x) + 0.5;
            const z = Math.floor(point.z) + 0.5;

            const result = gameManager.handleInput(selectedTool, x, z);
            if (result && !result.success) {
                if (result.data && result.data.type === "buy_land") {
                    buyLandData = result.data;
                } else if (result.message) {
                    notification = result.message;
                }
            }
        }
    }

    function confirmBuyLand() {
        if (buyLandData) {
            if (gameManager.unlockChunk(buyLandData.cx, buyLandData.cz)) {
                notification = "Land Purchased!";
            } else {
                notification = "Not enough coins!";
            }
            buyLandData = null;
        }
    }

    function onPointerMove(event: MouseEvent) {
        if (event.target !== renderer.domElement) {
            inputManager.updateHoverIndicator(0, 0, false);
            return;
        }

        const intersect = inputManager.getIntersection(event);

        if (intersect) {
            const point = intersect.point;

            // Snap to grid
            const x = Math.floor(point.x) + 0.5;
            const z = Math.floor(point.z) + 0.5;

            const hoverState = gameManager.getHoverState(selectedTool, x, z);
            inputManager.updateHoverIndicator(
                x,
                z,
                hoverState.visible,
                hoverState.color,
                hoverState.scaleY,
                hoverState.posY,
            );
        } else {
            inputManager.updateHoverIndicator(0, 0, false);
        }
    }

    function handleBuy(event: CustomEvent) {
        const item = event.detail.item;
        const price = PRICES[item].buy;

        // We can access inventory via gameManager or store, but gameManager handles logic
        if (gameManager.inventoryManager.getCount("coins") >= price) {
            gameManager.inventoryManager.removeItem("coins", price);
            gameManager.inventoryManager.addItem(item, 1);
            notification = `Bought ${item.replace("_", " ")}!`;
        } else {
            notification = "Not enough coins!";
        }
    }

    function handleSell(event: CustomEvent) {
        const item = event.detail.item;
        const price = PRICES[item].sell;

        if (gameManager.inventoryManager.getCount(item) > 0) {
            gameManager.inventoryManager.removeItem(item, 1);
            gameManager.inventoryManager.addItem("coins", price);
            notification = `Sold ${item.replace("_", " ")}!`;
        } else {
            notification = "Nothing to sell!";
        }
    }

    function onKeyDown(event: KeyboardEvent) {
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "s"
        ) {
            event.preventDefault();
            saveGame();
        }
    }
</script>

<div bind:this={container} class="game-container"></div>

<HUD
    bind:selectedTool
    bind:notification
    on:save={saveGame}
    on:delete={deleteGame}
    on:buy={handleBuy}
    on:sell={handleSell}
    on:openTestScene={() => dispatch("openTestScene")}
/>

{#if buyLandData}
    <ConfirmationDialog
        title="Expand Land"
        message={`Buy this area for ${buyLandData.price} coins?`}
        onConfirm={confirmBuyLand}
        onCancel={() => (buyLandData = null)}
    />
{/if}

<style>
    .game-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
</style>
