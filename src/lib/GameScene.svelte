<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { GameManager } from "./game/GameManager";
    import { InputManager } from "./game/InputManager";
    import { PersistenceManager } from "./game/PersistenceManager";
    import HUD from "./HUD.svelte";
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
    let inventory: any = {};
    let produceCount: number = 0;
    let maxCapacity: number = 20;
    let notification: string | null = null;

    onMount(() => {
        init();
        animate();
        window.addEventListener("resize", onWindowResize);
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
    });

    onDestroy(() => {
        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
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
    });

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
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableRotate = false; // Disable rotation
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.minZoom = 0.5; // Prevent zooming out too far
        controls.maxZoom = 2; // Prevent zooming in too close

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshBasicMaterial({
            visible: false,
        }); // Invisible for raycasting
        ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // Managers
        gameManager = new GameManager(scene);
        inputManager = new InputManager(camera, ground, scene);

        // Subscribe to inventory
        gameManager.inventoryManager.subscribe((inv) => {
            inventory = inv;
            produceCount = gameManager.inventoryManager.getProduceCount();
            maxCapacity = gameManager.inventoryManager.getMaxCapacity();
        });

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
        // Prefill with grass
        for (let x = -10; x < 10; x++) {
            for (let z = -10; z < 10; z++) {
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

        if (selectedTool === "none") return;

        const intersect = inputManager.getIntersection(event);

        if (intersect) {
            const point = intersect.point;

            // Snap to grid (assuming 1x1 tiles)
            const x = Math.floor(point.x) + 0.5;
            const z = Math.floor(point.z) + 0.5;

            const result = gameManager.handleInput(selectedTool, x, z);
            if (result && !result.success && result.message) {
                notification = result.message;
            }
        }
    }

    function onPointerMove(event: MouseEvent) {
        if (selectedTool === "none" || event.target !== renderer.domElement) {
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

        if (inventory["coins"] >= price) {
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

        if (inventory[item] > 0) {
            gameManager.inventoryManager.removeItem(item, 1);
            gameManager.inventoryManager.addItem("coins", price);
            notification = `Sold ${item.replace("_", " ")}!`;
        } else {
            notification = "Nothing to sell!";
        }
    }
</script>

<div bind:this={container} class="game-container"></div>

<HUD
    bind:selectedTool
    {inventory}
    {produceCount}
    {maxCapacity}
    bind:notification
    on:save={saveGame}
    on:delete={deleteGame}
    on:buy={handleBuy}
    on:sell={handleSell}
    on:openTestScene={() => dispatch("openTestScene")}
/>

<style>
    .game-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
</style>
