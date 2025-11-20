<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { TileManager } from "./game/TileManager";
    import { InputManager } from "./game/InputManager";
    import HUD from "./HUD.svelte";

    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let ground: THREE.Mesh;
    let animationId: number;

    let tileManager: TileManager;
    let inputManager: InputManager;

    let selectedTool:
        | "none"
        | "dirt"
        | "grass"
        | "path"
        | "water"
        | "wheat"
        | "carrot"
        | "tomato" = "none";

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
        if (tileManager) tileManager.dispose();
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
        tileManager = new TileManager(scene);
        inputManager = new InputManager(camera, ground, scene);

        loadGame();
    }

    function saveGame() {
        const data = tileManager.serialize();
        localStorage.setItem("beehive_save", JSON.stringify(data));
        alert("Game Saved!");
    }

    function deleteGame() {
        localStorage.removeItem("beehive_save");
        location.reload(); // Reload to reset state
    }

    function loadGame() {
        const savedData = localStorage.getItem("beehive_save");
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                tileManager.load(data);
            } catch (e) {
                console.error("Failed to load save data", e);
                // Fallback to default
                prefillGrass();
            }
        } else {
            prefillGrass();
        }
    }

    function prefillGrass() {
        // Prefill with grass
        for (let x = -10; x < 10; x++) {
            for (let z = -10; z < 10; z++) {
                tileManager.createTile(x + 0.5, z + 0.5, "grass");
            }
        }
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        if (controls) {
            controls.update();
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
        if (selectedTool === "none") return;

        const intersect = inputManager.getIntersection(event);

        if (intersect) {
            const point = intersect.point;

            // Snap to grid (assuming 1x1 tiles)
            const x = Math.floor(point.x) + 0.5;
            const z = Math.floor(point.z) + 0.5;

            if (
                selectedTool === "wheat" ||
                selectedTool === "carrot" ||
                selectedTool === "tomato"
            ) {
                tileManager.createCrop(x, z, selectedTool);
            } else if (selectedTool === "water") {
                tileManager.waterTile(x, z);
            } else if (
                selectedTool === "dirt" ||
                selectedTool === "grass" ||
                selectedTool === "path"
            ) {
                tileManager.createTile(x, z, selectedTool);
            }
        }
    }

    function onPointerMove(event: MouseEvent) {
        if (selectedTool === "none") {
            inputManager.updateHoverIndicator(0, 0, false);
            return;
        }

        const intersect = inputManager.getIntersection(event);

        if (intersect) {
            const point = intersect.point;

            // Snap to grid
            const x = Math.floor(point.x) + 0.5;
            const z = Math.floor(point.z) + 0.5;

            // Check validity for crops or water
            if (
                selectedTool === "wheat" ||
                selectedTool === "carrot" ||
                selectedTool === "tomato" ||
                selectedTool === "water"
            ) {
                const tileType = tileManager.getTileType(x, z);
                if (tileType === "dirt") {
                    if (selectedTool === "water") {
                        // Water tool
                        inputManager.updateHoverIndicator(
                            x,
                            z,
                            true,
                            0x0000ff,
                            1.1,
                            0.05,
                        ); // Blue, slightly larger
                    } else {
                        let color = 0xffff00; // Wheat
                        if (selectedTool === "carrot") color = 0xffa500;
                        if (selectedTool === "tomato") color = 0xff6347;

                        inputManager.updateHoverIndicator(
                            x,
                            z,
                            true,
                            color,
                            0.5,
                            0.35,
                        );
                    }
                } else {
                    inputManager.updateHoverIndicator(0, 0, false);
                }
                return;
            }

            // Update indicator color based on tool
            let color = 0xffffff;
            let scaleY = 1;
            let posY = 0.05;

            if (selectedTool === "dirt") {
                color = 0x8b4513;
                scaleY = 1;
                posY = 0.05;
            } else if (selectedTool === "grass") {
                color = 0x228b22;
                scaleY = 3;
                posY = 0.15;
            } else if (selectedTool === "path") {
                color = 0x808080;
                scaleY = 4;
                posY = 0.2;
            }

            inputManager.updateHoverIndicator(x, z, true, color, scaleY, posY);
        } else {
            inputManager.updateHoverIndicator(0, 0, false);
        }
    }
</script>

<div bind:this={container} class="game-container"></div>

<HUD bind:selectedTool on:save={saveGame} on:delete={deleteGame} />

<style>
    .game-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
</style>
