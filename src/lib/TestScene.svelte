<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { CropManager } from "./game/CropManager";
    import { StructureManager } from "./game/StructureManager";
    import { TreeManager } from "./game/TreeManager";
    import { GridManager } from "./game/GridManager";
    import { SignManager } from "./game/SignManager";
    import { FenceManager } from "./game/FenceManager";
    import type { CropType, TileType } from "./game/types";

    export let onBack: () => void;

    let container: HTMLDivElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let animationId: number;

    // Managers
    let cropManager: CropManager;
    let structureManager: StructureManager;
    let treeManager: TreeManager;
    let gridManager: GridManager;
    let signManager: SignManager | undefined = undefined;
    let fenceManager: FenceManager | undefined = undefined;

    // State
    let selectedType: string = "house";
    let selectedTile: string = "grass";
    let selectedGridSize: number = 2;
    let selectedStage: number = 2; // Default to fully grown/complete
    let showHighlights: boolean = false;
    let highlightMesh: THREE.Mesh | undefined;

    const supportedHighlightTypes = ["sign"];

    const objectTypes = [
        { id: "house", name: "House" },
        { id: "tree", name: "Tree" },
        { id: "sign", name: "Sign" },
        { id: "fence", name: "Fence" },
        { id: "wheat", name: "Wheat" },
        { id: "carrot", name: "Carrot" },
        { id: "tomato", name: "Tomato" },
        { id: "none", name: "None" },
    ];

    const tileTypes = [
        { id: "grass", name: "Grass" },
        { id: "dirt", name: "Dirt" },
        { id: "path", name: "Path" },
        { id: "none", name: "None" },
    ];

    onMount(() => {
        init();
        animate();
        updateObject();
        window.addEventListener("resize", onWindowResize);
    });

    onDestroy(() => {
        window.removeEventListener("resize", onWindowResize);
        if (renderer) renderer.dispose();
        if (controls) controls.dispose();
        if (animationId) cancelAnimationFrame(animationId);

        // Dispose managers
        if (cropManager) cropManager.dispose();
        if (structureManager) structureManager.dispose();
        if (treeManager) treeManager.dispose();
        if (signManager) signManager.dispose();
        if (fenceManager) fenceManager.dispose();
    });

    function init() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333); // Dark gray background for better contrast

        // Camera
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.set(2, 2, 2);
        camera.lookAt(0, 0, 0);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Back light to see the other side clearly
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-5, 5, -7.5);
        scene.add(backLight);

        // Grid Helper
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        // Axes Helper
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // Initialize Managers
        cropManager = new CropManager(scene);
        structureManager = new StructureManager(scene);
        treeManager = new TreeManager(scene);
        gridManager = new GridManager(scene);
        signManager = new SignManager(scene);
        fenceManager = new FenceManager(scene);

        // We need to hack the structure manager a bit because it creates the hut in constructor
        // We'll clear it immediately so we can control it via updateObject
        structureManager.dispose();
    }

    function clearScene() {
        // Clear objects created by managers
        cropManager.dispose();
        structureManager.dispose();
        treeManager.dispose();
        gridManager.dispose();
        signManager?.dispose();
        fenceManager?.dispose();

        // Re-init managers to clear internal state maps
        cropManager = new CropManager(scene);
        structureManager = new StructureManager(scene);
        // StructureManager creates a hut in constructor, remove it immediately
        structureManager.dispose();

        treeManager = new TreeManager(scene);
        gridManager = new GridManager(scene);
        signManager = new SignManager(scene);
        fenceManager = new FenceManager(scene);
    }

    function updateObject() {
        if (!scene) return;

        clearScene();
        if (highlightMesh) {
            scene.remove(highlightMesh);
            highlightMesh.geometry.dispose();
            (highlightMesh.material as THREE.Material).dispose();
            highlightMesh = undefined;
        }

        // Create selected tile (grid)
        if (selectedTile !== "none") {
            const type = selectedTile as TileType;
            const offset = (selectedGridSize - 1) / 2;
            for (let x = 0; x < selectedGridSize; x++) {
                for (let z = 0; z < selectedGridSize; z++) {
                    gridManager.createTile(x - offset, z - offset, type);
                }
            }
        }

        if (selectedType === "house") {
            // StructureManager creates hut in constructor, but we disposed it.
            // Let's make a new one.
            structureManager = new StructureManager(scene);
            // It creates at 0,0 by default
        } else if (selectedType === "tree") {
            treeManager.createTree(0, 0);
            // Force stage
            const key = "0,0";
            const data = treeManager.trees.get(key);
            if (data && selectedStage > 0) {
                data.growthStage = selectedStage;
                treeManager.updateVisuals(data);
            }
        } else if (selectedType === "sign") {
            signManager?.createSingleSign(0, 0);
            if (showHighlights) {
                const geometry = new THREE.BoxGeometry(1, 0.1, 1);
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    transparent: true,
                    opacity: 0.5,
                    depthTest: false,
                    depthWrite: false,
                });
                highlightMesh = new THREE.Mesh(geometry, material);

                // Match GameManager logic
                // Board dims: 1 x 0.6 x 0.1
                // Indicator base: 1 x 0.1 x 1
                // Rotate X 90: Local Z (1) -> World Y. Local Y (0.1) -> World Z.
                // We want World Y = 0.7 -> Scale Z = 0.7
                // We want World Z = 0.2 -> Scale Y = 2.0
                // We want World X = 1.1 -> Scale X = 1.1
                highlightMesh.scale.set(1.1, 2.0, 0.7);
                highlightMesh.rotation.set(Math.PI / 2, 0, 0);
                highlightMesh.position.set(0, 1, 0.06);

                scene.add(highlightMesh);
            }
        } else if (selectedType === "fence") {
            fenceManager?.createSingleFence(0, 0);
        } else if (selectedType === "none") {
            // Do nothing
        } else {
            // Crops
            cropManager.createCrop(0, 0, selectedType as CropType);
            const key = "0,0";
            const data = cropManager.crops.get(key);
            if (data && selectedStage > 0) {
                data.growthStage = selectedStage;
                cropManager.updateVisuals(data);
            }
        }
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
</script>

<div class="ui-overlay">
    <div class="panel">
        <h2>Test Scene</h2>
        <button on:click={onBack}>Back to Game</button>

        <div class="control-group">
            <label for="tile-select">Tile:</label>
            <select
                id="tile-select"
                bind:value={selectedTile}
                on:change={updateObject}
            >
                {#each tileTypes as type}
                    <option value={type.id}>{type.name}</option>
                {/each}
            </select>
        </div>

        {#if selectedTile !== "none"}
            <div class="control-group">
                <label for="grid-size">Grid Size:</label>
                <select
                    id="grid-size"
                    bind:value={selectedGridSize}
                    on:change={updateObject}
                >
                    <option value={1}>1x1</option>
                    <option value={2}>2x2</option>
                    <option value={3}>3x3</option>
                </select>
            </div>
        {/if}

        <div class="control-group">
            <label for="type-select">Object:</label>
            <select
                id="type-select"
                bind:value={selectedType}
                on:change={updateObject}
            >
                {#each objectTypes as type}
                    <option value={type.id}>{type.name}</option>
                {/each}
            </select>
        </div>

        {#if supportedHighlightTypes.includes(selectedType)}
            <div class="control-group">
                <label>
                    <input
                        type="checkbox"
                        bind:checked={showHighlights}
                        on:change={updateObject}
                    />
                    Show Highlights
                </label>
            </div>
        {/if}

        {#if selectedType !== "house" && selectedType !== "none"}
            <div class="control-group">
                <label for="stage-select">Growth Stage:</label>
                <input
                    id="stage-select"
                    type="range"
                    min="0"
                    max="2"
                    step="1"
                    bind:value={selectedStage}
                    on:input={updateObject}
                />
                <span>{selectedStage}</span>
            </div>
        {/if}

        <div class="instructions">
            <p>Left Click: Rotate</p>
            <p>Right Click: Pan</p>
            <p>Scroll: Zoom</p>
        </div>
    </div>
</div>

<div bind:this={container} class="scene-container"></div>

<style>
    .scene-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .ui-overlay {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 100;
    }

    .panel {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 15px;
        border-radius: 8px;
        min-width: 200px;
    }

    h2 {
        margin-top: 0;
        font-size: 1.2rem;
    }

    button {
        background: #4caf50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        margin-bottom: 15px;
    }

    button:hover {
        background: #45a049;
    }

    .control-group {
        margin-bottom: 10px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-size: 0.9rem;
    }

    select,
    input {
        width: 100%;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .instructions {
        margin-top: 20px;
        font-size: 0.8rem;
        color: #aaa;
    }

    .instructions p {
        margin: 2px 0;
    }
</style>
