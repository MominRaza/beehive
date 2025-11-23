<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import type { GameObject } from "./game/GameObject";
    import { GrowableObject } from "./game/growables/GrowableObject";
    import { Crop } from "./game/growables/crops/Crop";
    import { House } from "./game/structures/House";
    import { Well } from "./game/structures/Well";
    import { Soil } from "./game/tiles/Soil";
    import { Grass } from "./game/tiles/Grass";
    import { Path } from "./game/tiles/Path";
    import { Wheat } from "./game/growables/crops/Wheat";
    import { Carrot } from "./game/growables/crops/Carrot";
    import { Tomato } from "./game/growables/crops/Tomato";
    import { Pine } from "./game/growables/trees/Pine";
    import { Oak } from "./game/growables/trees/Oak";
    import { Apple } from "./game/growables/trees/fruitTrees/Apple";
    import { Mango } from "./game/growables/trees/fruitTrees/Mango";

    let { onBack }: { onBack: () => void } = $props();

    let container: HTMLDivElement;
    let frameId: number;
    let gameObjects: GameObject[] = [];
    let scene: THREE.Scene;
    let mounted = $state(false);
    let selectedType = $state(localStorage.getItem("selectedType") || "All");

    const objectTypes = [
        "All",
        "Tiles",
        "Structures",
        "Wheat",
        "Carrot",
        "Tomato",
        "Pine",
        "Oak",
        "Apple",
        "Mango",
    ];

    function spawn(obj: GameObject) {
        obj.addToScene(scene);
        gameObjects.push(obj);
        obj.enableShadows();
    }

    function spawnSequence(
        ClassRef: new (x: number, z: number) => GrowableObject,
        z: number,
        startX: number = 0,
    ) {
        const temp = new ClassRef(0, 0);
        const isCrop = temp instanceof Crop;

        let i = 0;
        while (true) {
            const x = startX + i * (isCrop ? 1 : 2);
            const obj = new ClassRef(x, z);
            if (!obj.setCurrentStage(i)) break;

            if (isCrop) {
                spawn(new Soil(x, z));
            } else {
                spawn(new Grass(x, z));
            }

            spawn(obj);

            i++;
        }
    }

    function renderScene() {
        if (!scene) return;

        // Cleanup
        gameObjects.forEach((obj) => obj.removeFromScene(scene));
        gameObjects = [];

        if (selectedType === "All") {
            let currentZ = -6;
            // Tiles
            spawn(new Soil(-4, currentZ));
            spawn(new Grass(-2, currentZ));
            spawn(new Path(0, currentZ));

            // Structures
            spawn(new Grass(2, currentZ));
            spawn(new Grass(3, currentZ));
            currentZ++;
            spawn(new Grass(2, currentZ));
            spawn(new Grass(3, currentZ));
            spawn(new House(2.5, currentZ - 0.5));
            spawn(new Grass(5, currentZ));
            spawn(new Well(5, currentZ));

            // Sequences
            currentZ++;
            spawnSequence(Wheat, currentZ, -4);
            currentZ++;
            spawnSequence(Carrot, currentZ, -4);
            currentZ++;
            spawnSequence(Tomato, currentZ, -4);

            currentZ += 2;
            spawnSequence(Pine, currentZ, -4);
            currentZ += 2;
            spawnSequence(Oak, currentZ, -4);
            currentZ += 2;
            spawnSequence(Apple, currentZ, -4);
            currentZ += 2;
            spawnSequence(Mango, currentZ, -4);
        } else if (selectedType === "Tiles") {
            spawn(new Soil(-2, 0));
            spawn(new Grass(0, 0));
            spawn(new Path(2, 0));
        } else if (selectedType === "Structures") {
            spawn(new Grass(-2, 0));
            spawn(new Grass(-1, 0));
            spawn(new Grass(-2, 1));
            spawn(new Grass(-1, 1));
            spawn(new House(-1.5, 0.5));

            spawn(new Grass(2, 0));
            spawn(new Well(2, 0));
        } else {
            // Individual sequences
            const map: Record<string, any> = {
                Wheat: Wheat,
                Carrot: Carrot,
                Tomato: Tomato,
                Pine: Pine,
                Oak: Oak,
                Apple: Apple,
                Mango: Mango,
            };
            const ClassRef = map[selectedType];
            if (ClassRef) {
                spawnSequence(ClassRef, 0, -2); // Center it a bit
            }
        }
    }

    $effect(() => {
        localStorage.setItem("selectedType", selectedType);
    });

    $effect(() => {
        if (mounted) {
            renderScene();
        }
    });

    onMount(() => {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87ceeb);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.set(-5, 5, 0);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-5, 15, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        const dLight = 10;
        directionalLight.shadow.camera.left = -dLight;
        directionalLight.shadow.camera.right = dLight;
        directionalLight.shadow.camera.top = dLight;
        directionalLight.shadow.camera.bottom = -dLight;
        scene.add(directionalLight);

        const gridHelper = new THREE.GridHelper(20, 20);
        scene.add(gridHelper);

        mounted = true;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            controls.dispose();
            renderer.dispose();
            gameObjects.forEach((obj) => obj.removeFromScene(scene));
        };
    });
</script>

<div bind:this={container} class="scene-container"></div>

<div class="ui-overlay">
    <button class="back-button" onclick={onBack}>Back to Menu</button>

    <div class="controls">
        <label for="type-select">Display:</label>
        <select id="type-select" bind:value={selectedType}>
            {#each objectTypes as type}
                <option value={type}>{type}</option>
            {/each}
        </select>
    </div>
</div>

<style>
    .scene-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .ui-overlay {
        position: absolute;
        top: 20px;
        left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 100;
    }

    .back-button {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: white;
        cursor: pointer;
        border-radius: 4px;
        backdrop-filter: blur(4px);
        transition: all 0.2s;
        font-family: sans-serif;
        width: fit-content;
    }

    .back-button:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .controls {
        padding: 12px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        color: white;
        font-family: sans-serif;
        backdrop-filter: blur(4px);
    }

    select {
        margin-left: 8px;
        padding: 4px;
        border-radius: 4px;
        border: none;
        background: rgba(255, 255, 255, 0.9);
    }
</style>
