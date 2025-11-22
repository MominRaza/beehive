<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

    let { onBack } = $props<{ onBack: () => void }>();

    let container: HTMLDivElement;
    let frameId: number;

    onMount(() => {
        const scene = new THREE.Scene();

        // Isometric setup using OrthographicCamera
        const aspect = window.innerWidth / window.innerHeight;
        const d = 10;
        const camera = new THREE.OrthographicCamera(
            -d * aspect,
            d * aspect,
            d,
            -d,
            1,
            1000,
        );

        // Isometric position
        camera.position.set(20, 20, 20);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableRotate = false; // strict isometric usually implies fixed rotation, but user can pan/zoom
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        // 12x12 Grid Tile Plan
        // Using GridHelper for a clean grid look
        const size = 12;
        const divisions = 12;
        const gridHelper = new THREE.GridHelper(
            size,
            divisions,
            0x888888,
            0x444444,
        );
        scene.add(gridHelper);

        // Add a plane to receive shadows or just to be the "ground" visual if needed
        // For now, just the grid as requested.

        // Add a simple box to visualize the scene better
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 0.5; // sit on grid
        scene.add(cube);

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const aspect = window.innerWidth / window.innerHeight;
            camera.left = -d * aspect;
            camera.right = d * aspect;
            camera.top = d;
            camera.bottom = -d;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            controls.dispose();
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    });
</script>

<div bind:this={container} class="scene-container"></div>

<button class="back-button" onclick={onBack}>Back to Menu</button>

<style>
    .scene-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: #111;
    }

    .back-button {
        position: absolute;
        top: 20px;
        left: 20px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: white;
        cursor: pointer;
        border-radius: 4px;
        backdrop-filter: blur(4px);
        transition: all 0.2s;
        font-family: sans-serif;
        z-index: 100;
    }

    .back-button:hover {
        background: rgba(255, 255, 255, 0.3);
    }
</style>
