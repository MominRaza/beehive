<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

    let { onBack } = $props<{ onBack: () => void }>();

    let container: HTMLDivElement;
    let frameId: number;

    onMount(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.set(5, 5, 5);
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(12, 12, 12, 12);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            wireframe: true,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // Soil Tile
        const soilGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const soilMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 }); // SaddleBrown
        const soilTile = new THREE.Mesh(soilGeometry, soilMaterial);
        soilTile.position.set(-2, 0.05, 0);
        scene.add(soilTile);

        // Grass Tile
        const grassTile = new THREE.Group();
        const grassSoilMesh = new THREE.Mesh(soilGeometry, soilMaterial);
        grassSoilMesh.position.y = 0.05;

        const grassTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 }); // ForestGreen
        const grassTopMesh = new THREE.Mesh(grassTopGeometry, grassMaterial);
        grassTopMesh.position.y = 0.15;

        grassTile.add(grassSoilMesh);
        grassTile.add(grassTopMesh);
        grassTile.position.x = 0;
        scene.add(grassTile);

        // Path Tile
        const pathTile = new THREE.Group();
        const pathSoilMesh = new THREE.Mesh(soilGeometry, soilMaterial);
        pathSoilMesh.position.y = 0.05;

        const pathGrassMesh = new THREE.Mesh(grassTopGeometry, grassMaterial);
        pathGrassMesh.position.y = 0.15;

        const pathTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const pathMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Gray
        const pathTopMesh = new THREE.Mesh(pathTopGeometry, pathMaterial);
        pathTopMesh.position.y = 0.25;

        pathTile.add(pathSoilMesh);
        pathTile.add(pathGrassMesh);
        pathTile.add(pathTopMesh);
        pathTile.position.x = 2;
        scene.add(pathTile);

        // --- Crops Display ---
        const cropsGroup = new THREE.Group();
        scene.add(cropsGroup);

        const createSoilBase = (x: number, z: number) => {
            const geo = new THREE.BoxGeometry(1, 0.1, 1);
            const mat = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, 0.05, z);
            cropsGroup.add(mesh);
            return { geo, mat };
        };

        const createCrop = (
            type: "wheat" | "carrot" | "tomato",
            stage: 1 | 2 | 3 | 4,
            x: number,
            z: number,
        ) => {
            const group = new THREE.Group();
            group.position.set(x, 0.1, z); // On top of soil (0.1 height)

            // Stage 1 (Sprout) - Same for all
            if (stage === 1) {
                const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
                const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.y = 0.1;
                group.add(mesh);
            } else if (type === "wheat") {
                if (stage === 2) {
                    const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.2;
                    group.add(mesh);
                } else if (stage === 3) {
                    const geo = new THREE.CylinderGeometry(0.08, 0.08, 0.6);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.3;
                    group.add(mesh);
                } else if (stage === 4) {
                    const stalkGeo = new THREE.CylinderGeometry(
                        0.05,
                        0.05,
                        0.6,
                    );
                    const stalkMat = new THREE.MeshBasicMaterial({
                        color: 0xcccc00,
                    });
                    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
                    stalk.position.y = 0.3;
                    group.add(stalk);

                    const headGeo = new THREE.BoxGeometry(0.15, 0.3, 0.15);
                    const headMat = new THREE.MeshBasicMaterial({
                        color: 0xffd700,
                    });
                    const head = new THREE.Mesh(headGeo, headMat);
                    head.position.y = 0.75;
                    group.add(head);
                }
            } else if (type === "carrot") {
                if (stage === 2) {
                    const geo = new THREE.ConeGeometry(0.15, 0.3, 8);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.15;
                    group.add(mesh);
                } else if (stage === 3) {
                    const geo = new THREE.ConeGeometry(0.25, 0.5, 8);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.25;
                    group.add(mesh);
                } else if (stage === 4) {
                    const geo = new THREE.ConeGeometry(0.3, 0.6, 8);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.3;
                    group.add(mesh);

                    const baseGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.1);
                    const baseMat = new THREE.MeshBasicMaterial({
                        color: 0xff8c00,
                    });
                    const base = new THREE.Mesh(baseGeo, baseMat);
                    base.position.y = 0.05;
                    group.add(base);
                }
            } else if (type === "tomato") {
                if (stage === 2) {
                    const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.2;
                    group.add(mesh);

                    const leafGeo = new THREE.BoxGeometry(0.2, 0.02, 0.05);
                    const leaf = new THREE.Mesh(leafGeo, mat);
                    leaf.position.set(0.1, 0.3, 0);
                    group.add(leaf);
                } else if (stage === 3) {
                    const geo = new THREE.DodecahedronGeometry(0.25);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.3;
                    group.add(mesh);

                    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
                    const stem = new THREE.Mesh(stemGeo, mat);
                    stem.position.y = 0.15;
                    group.add(stem);
                } else if (stage === 4) {
                    const geo = new THREE.DodecahedronGeometry(0.3);
                    const mat = new THREE.MeshBasicMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.4;
                    group.add(mesh);

                    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
                    const stem = new THREE.Mesh(stemGeo, mat);
                    stem.position.y = 0.2;
                    group.add(stem);

                    const fruitGeo = new THREE.SphereGeometry(0.08);
                    const fruitMat = new THREE.MeshBasicMaterial({
                        color: 0xff0000,
                    });

                    const f1 = new THREE.Mesh(fruitGeo, fruitMat);
                    f1.position.set(0.2, 0.4, 0.1);
                    group.add(f1);

                    const f2 = new THREE.Mesh(fruitGeo, fruitMat);
                    f2.position.set(-0.15, 0.5, 0.2);
                    group.add(f2);

                    const f3 = new THREE.Mesh(fruitGeo, fruitMat);
                    f3.position.set(0.1, 0.3, -0.2);
                    group.add(f3);
                }
            }

            cropsGroup.add(group);
        };

        // Generate Grid
        const crops = ["wheat", "carrot", "tomato"] as const;
        const startZ = -2;
        const startX = -2;
        const spacingX = 1.5;
        const spacingZ = 1.5;

        crops.forEach((crop, rowIndex) => {
            for (let stage = 1; stage <= 4; stage++) {
                const x = startX + (stage - 1) * spacingX;
                const z = startZ - rowIndex * spacingZ;

                createSoilBase(x, z);
                createCrop(crop, stage as 1 | 2 | 3 | 4, x, z);
            }
        });

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

            groundGeometry.dispose();
            groundMaterial.dispose();

            soilGeometry.dispose();
            soilMaterial.dispose();
            grassTopGeometry.dispose();
            grassMaterial.dispose();
            pathTopGeometry.dispose();
            pathMaterial.dispose();
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
