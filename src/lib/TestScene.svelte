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

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(12, 12, 12, 12);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            wireframe: true,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Soil Tile
        const soilGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const soilMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
        }); // SaddleBrown
        const soilTile = new THREE.Mesh(soilGeometry, soilMaterial);
        soilTile.position.set(-2, 0.05, 6);
        soilTile.receiveShadow = true;
        scene.add(soilTile);

        // Grass Tile
        const grassTile = new THREE.Group();
        const grassSoilMesh = new THREE.Mesh(soilGeometry, soilMaterial);
        grassSoilMesh.position.y = 0.05;
        grassSoilMesh.receiveShadow = true;

        const grassTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        }); // ForestGreen
        const grassTopMesh = new THREE.Mesh(grassTopGeometry, grassMaterial);
        grassTopMesh.position.y = 0.15;
        grassTopMesh.receiveShadow = true;
        grassTopMesh.castShadow = true;

        grassTile.add(grassSoilMesh);
        grassTile.add(grassTopMesh);
        grassTile.position.x = 0;
        grassTile.position.z = 6;
        scene.add(grassTile);

        // Path Tile
        const pathTile = new THREE.Group();
        const pathSoilMesh = new THREE.Mesh(soilGeometry, soilMaterial);
        pathSoilMesh.position.y = 0.05;
        pathSoilMesh.receiveShadow = true;

        const pathGrassMesh = new THREE.Mesh(grassTopGeometry, grassMaterial);
        pathGrassMesh.position.y = 0.15;
        pathGrassMesh.receiveShadow = true;
        pathGrassMesh.castShadow = true;

        const pathTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const pathMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
        }); // Gray
        const pathTopMesh = new THREE.Mesh(pathTopGeometry, pathMaterial);
        pathTopMesh.position.y = 0.25;
        pathTopMesh.receiveShadow = true;
        pathTopMesh.castShadow = true;

        pathTile.add(pathSoilMesh);
        pathTile.add(pathGrassMesh);
        pathTile.add(pathTopMesh);
        pathTile.position.x = 2;
        pathTile.position.z = 6;
        scene.add(pathTile);

        // --- Crops Display ---
        const cropsGroup = new THREE.Group();
        scene.add(cropsGroup);

        const createSoilBase = (x: number, z: number) => {
            const geo = new THREE.BoxGeometry(1, 0.1, 1);
            const mat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, 0.05, z);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            cropsGroup.add(mesh);
            return { geo, mat };
        };

        const createGrassBase = (x: number, z: number) => {
            const group = new THREE.Group();

            // Soil part
            const soilGeo = new THREE.BoxGeometry(1, 0.1, 1);
            const soilMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const soilMesh = new THREE.Mesh(soilGeo, soilMat);
            soilMesh.position.y = 0.05;
            soilMesh.receiveShadow = true;
            group.add(soilMesh);

            // Grass top part
            const grassGeo = new THREE.BoxGeometry(1, 0.1, 1);
            const grassMat = new THREE.MeshStandardMaterial({
                color: 0x228b22,
            });
            const grassMesh = new THREE.Mesh(grassGeo, grassMat);
            grassMesh.position.y = 0.15;
            grassMesh.receiveShadow = true;
            grassMesh.castShadow = true;
            group.add(grassMesh);

            group.position.set(x, 0, z);
            cropsGroup.add(group);
            return group;
        };

        const createCrop = (
            type:
                | "wheat"
                | "carrot"
                | "tomato"
                | "pine"
                | "oak"
                | "apple"
                | "mango",
            stage: 1 | 2 | 3 | 4 | 5,
            x: number,
            z: number,
        ) => {
            const group = new THREE.Group();
            const isTree = ["pine", "oak", "apple", "mango"].includes(type);
            const y = isTree ? 0.2 : 0.1;
            group.position.set(x, y, z);

            const addMesh = (mesh: THREE.Mesh) => {
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                group.add(mesh);
            };

            // Stage 1 (Sprout) - Same for all
            if (stage === 1) {
                const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
                const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.y = 0.1;
                addMesh(mesh);
            } else if (type === "wheat") {
                if (stage === 2) {
                    const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.2;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const geo = new THREE.CylinderGeometry(0.08, 0.08, 0.6);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.3;
                    addMesh(mesh);
                } else if (stage === 4) {
                    const stalkGeo = new THREE.CylinderGeometry(
                        0.05,
                        0.05,
                        0.6,
                    );
                    const stalkMat = new THREE.MeshStandardMaterial({
                        color: 0xcccc00,
                    });
                    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
                    stalk.position.y = 0.3;
                    addMesh(stalk);

                    const headGeo = new THREE.BoxGeometry(0.15, 0.3, 0.15);
                    const headMat = new THREE.MeshStandardMaterial({
                        color: 0xffd700,
                    });
                    const head = new THREE.Mesh(headGeo, headMat);
                    head.position.y = 0.75;
                    addMesh(head);
                }
            } else if (type === "carrot") {
                if (stage === 2) {
                    const geo = new THREE.ConeGeometry(0.15, 0.3, 8);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.15;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const geo = new THREE.ConeGeometry(0.25, 0.5, 8);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.25;
                    addMesh(mesh);
                } else if (stage === 4) {
                    const geo = new THREE.ConeGeometry(0.3, 0.6, 8);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.3;
                    addMesh(mesh);

                    const baseGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.1);
                    const baseMat = new THREE.MeshStandardMaterial({
                        color: 0xff8c00,
                    });
                    const base = new THREE.Mesh(baseGeo, baseMat);
                    base.position.y = 0.05;
                    addMesh(base);
                }
            } else if (type === "tomato") {
                if (stage === 2) {
                    const geo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.2;
                    addMesh(mesh);

                    const leafGeo = new THREE.BoxGeometry(0.2, 0.02, 0.05);
                    const leaf = new THREE.Mesh(leafGeo, mat);
                    leaf.position.set(0.1, 0.3, 0);
                    addMesh(leaf);
                } else if (stage === 3) {
                    const geo = new THREE.DodecahedronGeometry(0.25);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.3;
                    addMesh(mesh);

                    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
                    const stem = new THREE.Mesh(stemGeo, mat);
                    stem.position.y = 0.15;
                    addMesh(stem);
                } else if (stage === 4) {
                    const geo = new THREE.DodecahedronGeometry(0.3);
                    const mat = new THREE.MeshStandardMaterial({
                        color: 0x228b22,
                    });
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.4;
                    addMesh(mesh);

                    const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
                    const stem = new THREE.Mesh(stemGeo, mat);
                    stem.position.y = 0.2;
                    addMesh(stem);

                    const fruitGeo = new THREE.SphereGeometry(0.08);
                    const fruitMat = new THREE.MeshStandardMaterial({
                        color: 0xff0000,
                    });

                    const f1 = new THREE.Mesh(fruitGeo, fruitMat);
                    f1.position.set(0.2, 0.4, 0.1);
                    addMesh(f1);

                    const f2 = new THREE.Mesh(fruitGeo, fruitMat);
                    f2.position.set(-0.15, 0.5, 0.2);
                    addMesh(f2);

                    const f3 = new THREE.Mesh(fruitGeo, fruitMat);
                    f3.position.set(0.1, 0.3, -0.2);
                    addMesh(f3);
                }
            } else if (type === "pine") {
                const mat = new THREE.MeshStandardMaterial({ color: 0x2e8b57 }); // SeaGreen
                const trunkMat = new THREE.MeshStandardMaterial({
                    color: 0x8b4513,
                });

                if (stage === 2) {
                    const geo = new THREE.ConeGeometry(0.15, 0.4, 8);
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.2;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const trunkGeo = new THREE.CylinderGeometry(
                        0.05,
                        0.05,
                        0.3,
                    );
                    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                    trunk.position.y = 0.15;
                    addMesh(trunk);

                    const foliageGeo = new THREE.ConeGeometry(0.25, 0.6, 8);
                    const foliage = new THREE.Mesh(foliageGeo, mat);
                    foliage.position.y = 0.45;
                    addMesh(foliage);
                } else if (stage === 4) {
                    const trunkGeo = new THREE.CylinderGeometry(
                        0.08,
                        0.08,
                        0.4,
                    );
                    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                    trunk.position.y = 0.2;
                    addMesh(trunk);

                    const foliage1Geo = new THREE.ConeGeometry(0.35, 0.8, 8);
                    const foliage1 = new THREE.Mesh(foliage1Geo, mat);
                    foliage1.position.y = 0.6;
                    addMesh(foliage1);

                    const foliage2Geo = new THREE.ConeGeometry(0.25, 0.6, 8);
                    const foliage2 = new THREE.Mesh(foliage2Geo, mat);
                    foliage2.position.y = 1.0;
                    addMesh(foliage2);
                }
            } else if (type === "oak" || type === "apple" || type === "mango") {
                const mat = new THREE.MeshStandardMaterial({ color: 0x228b22 }); // ForestGreen
                const trunkMat = new THREE.MeshStandardMaterial({
                    color: 0x8b4513,
                });

                if (stage === 2) {
                    const geo = new THREE.DodecahedronGeometry(0.2);
                    const mesh = new THREE.Mesh(geo, mat);
                    mesh.position.y = 0.2;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const trunkGeo = new THREE.CylinderGeometry(
                        0.05,
                        0.05,
                        0.3,
                    );
                    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                    trunk.position.y = 0.15;
                    addMesh(trunk);

                    const foliageGeo = new THREE.DodecahedronGeometry(0.3);
                    const foliage = new THREE.Mesh(foliageGeo, mat);
                    foliage.position.y = 0.45;
                    addMesh(foliage);
                } else if (stage >= 4) {
                    const trunkGeo = new THREE.CylinderGeometry(
                        0.08,
                        0.08,
                        0.5,
                    );
                    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                    trunk.position.y = 0.25;
                    addMesh(trunk);

                    const foliageGeo = new THREE.DodecahedronGeometry(0.4);
                    const foliage = new THREE.Mesh(foliageGeo, mat);
                    foliage.position.y = 0.65;
                    addMesh(foliage);

                    if (stage === 5) {
                        const fruitGeo = new THREE.SphereGeometry(0.08);
                        const fruitColor =
                            type === "apple" ? 0xff0000 : 0xffd700; // Red or Gold/Yellow
                        const fruitMat = new THREE.MeshStandardMaterial({
                            color: fruitColor,
                        });

                        const positions = [
                            [0.25, 0.6, 0.15],
                            [-0.2, 0.7, 0.2],
                            [0.1, 0.5, -0.25],
                            [-0.15, 0.8, -0.1],
                        ];

                        positions.forEach((pos) => {
                            const fruit = new THREE.Mesh(fruitGeo, fruitMat);
                            fruit.position.set(pos[0], pos[1], pos[2]);
                            addMesh(fruit);
                        });
                    }
                }
            }

            cropsGroup.add(group);
        };

        // Generate Grid
        const crops = [
            "wheat",
            "carrot",
            "tomato",
            "pine",
            "oak",
            "apple",
            "mango",
        ] as const;
        const startZ = 5;
        const startX = -2;
        const spacingX = 1;
        const spacingZ = 1;

        crops.forEach((crop, rowIndex) => {
            const maxStage = crop === "apple" || crop === "mango" ? 5 : 4;
            const isTree = ["pine", "oak", "apple", "mango"].includes(crop);

            for (let stage = 1; stage <= maxStage; stage++) {
                const x = startX + (stage - 1) * spacingX;
                const z = startZ - rowIndex * spacingZ;

                if (isTree) {
                    createGrassBase(x, z);
                } else {
                    createSoilBase(x, z);
                }
                createCrop(crop, stage as 1 | 2 | 3 | 4 | 5, x, z);
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
