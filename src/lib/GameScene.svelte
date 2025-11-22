<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import GameHUD from "./GameHUD.svelte";

    let { onBack } = $props<{ onBack: () => void }>();

    let container: HTMLDivElement;
    let frameId: number;
    let selectedSeed = $state<string | null>(null);

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
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableRotate = false; // strict isometric usually implies fixed rotation, but user can pan/zoom
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-10, 30, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        const dLight = 10;
        directionalLight.shadow.camera.left = -dLight;
        directionalLight.shadow.camera.right = dLight;
        directionalLight.shadow.camera.top = dLight;
        directionalLight.shadow.camera.bottom = -dLight;
        scene.add(directionalLight);

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

        // Tile Materials & Geometry (From TestScene)
        const soilGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const soilMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
        }); // SaddleBrown

        const grassTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        }); // ForestGreen

        const pathTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const pathMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
        }); // Gray

        // Crop Geometries & Materials
        // Stage 1 (Sprout) - Same for all
        const sproutGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
        const sproutMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

        // Wheat
        const wheatStage2Geo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
        const wheatStage2Mat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const wheatStage3Geo = new THREE.CylinderGeometry(0.08, 0.08, 0.6);
        const wheatStage3Mat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const wheatStalkGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const wheatStalkMat = new THREE.MeshStandardMaterial({
            color: 0xcccc00,
        });
        const wheatHeadGeo = new THREE.BoxGeometry(0.15, 0.3, 0.15);
        const wheatHeadMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
        });

        // Carrot
        const carrotStage2Geo = new THREE.ConeGeometry(0.15, 0.3, 8);
        const carrotStage2Mat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const carrotStage3Geo = new THREE.ConeGeometry(0.25, 0.5, 8);
        const carrotStage3Mat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const carrotLeafGeo = new THREE.ConeGeometry(0.3, 0.6, 8);
        const carrotLeafMat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const carrotBaseGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.1);
        const carrotBaseMat = new THREE.MeshStandardMaterial({
            color: 0xff8c00,
        });

        // Tomato
        const tomatoStage2Geo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
        const tomatoStage2Mat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const tomatoLeafGeo = new THREE.BoxGeometry(0.2, 0.02, 0.05);
        const tomatoStage3Geo = new THREE.DodecahedronGeometry(0.25);
        const tomatoStage3Mat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const tomatoStemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
        const tomatoBushGeo = new THREE.DodecahedronGeometry(0.3);
        const tomatoStemFinalGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
        const tomatoPlantMat = new THREE.MeshStandardMaterial({
            color: 0x228b22,
        });
        const tomatoFruitGeo = new THREE.SphereGeometry(0.08);
        const tomatoFruitMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
        });

        // Tree Materials
        const pineMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57 }); // SeaGreen
        const oakMat = new THREE.MeshStandardMaterial({ color: 0x228b22 }); // ForestGreen
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // SaddleBrown
        const appleFruitMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
        }); // Red
        const mangoFruitMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
        }); // Gold

        // Pine Geometries
        const pineStage2Geo = new THREE.ConeGeometry(0.15, 0.4, 8);
        const pineTrunkSmallGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
        const pineFoliageSmallGeo = new THREE.ConeGeometry(0.25, 0.6, 8);
        const pineTrunkLargeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4);
        const pineFoliageLarge1Geo = new THREE.ConeGeometry(0.35, 0.8, 8);
        const pineFoliageLarge2Geo = new THREE.ConeGeometry(0.25, 0.6, 8);

        // Oak/Apple/Mango Geometries
        const oakStage2Geo = new THREE.DodecahedronGeometry(0.2);
        const oakTrunkSmallGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
        const oakFoliageSmallGeo = new THREE.DodecahedronGeometry(0.3);
        const oakTrunkLargeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5);
        const oakFoliageLargeGeo = new THREE.DodecahedronGeometry(0.4);
        const fruitGeo = new THREE.SphereGeometry(0.08);

        const tiles = new Map<string, THREE.Object3D>();
        const crops = new Map<
            string,
            {
                mesh: THREE.Group;
                type: string;
                stage: number;
                plantedAt: number;
                lastStageUpdate: number;
            }
        >();

        const createSoilTile = (x: number, z: number) => {
            const mesh = new THREE.Mesh(soilGeometry, soilMaterial);
            mesh.position.set(x, 0.05, z);
            mesh.userData = { type: "soil" };
            mesh.receiveShadow = true;
            return mesh;
        };

        const createGrassTile = (x: number, z: number) => {
            const group = new THREE.Group();

            const soilMesh = new THREE.Mesh(soilGeometry, soilMaterial);
            soilMesh.position.y = 0.05;
            soilMesh.receiveShadow = true;
            group.add(soilMesh);

            const grassMesh = new THREE.Mesh(grassTopGeometry, grassMaterial);
            grassMesh.position.y = 0.15;
            grassMesh.receiveShadow = true;
            grassMesh.castShadow = true;
            group.add(grassMesh);

            group.position.set(x, 0, z);
            group.userData = { type: "grass" };
            return group;
        };

        const createPathTile = (x: number, z: number) => {
            const group = new THREE.Group();

            const soilMesh = new THREE.Mesh(soilGeometry, soilMaterial);
            soilMesh.position.y = 0.05;
            soilMesh.receiveShadow = true;
            group.add(soilMesh);

            const grassMesh = new THREE.Mesh(grassTopGeometry, grassMaterial);
            grassMesh.position.y = 0.15;
            grassMesh.receiveShadow = true;
            grassMesh.castShadow = true;
            group.add(grassMesh);

            const pathMesh = new THREE.Mesh(pathTopGeometry, pathMaterial);
            pathMesh.position.y = 0.25;
            pathMesh.receiveShadow = true;
            pathMesh.castShadow = true;
            group.add(pathMesh);

            group.position.set(x, 0, z);
            group.userData = { type: "path" };
            return group;
        };

        const createCrop = (
            type: string,
            stage: number,
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

            if (stage === 1) {
                const mesh = new THREE.Mesh(sproutGeo, sproutMat);
                mesh.position.y = 0.1;
                addMesh(mesh);
            } else if (type === "wheat") {
                if (stage === 2) {
                    const mesh = new THREE.Mesh(wheatStage2Geo, wheatStage2Mat);
                    mesh.position.y = 0.2;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const mesh = new THREE.Mesh(wheatStage3Geo, wheatStage3Mat);
                    mesh.position.y = 0.3;
                    addMesh(mesh);
                } else if (stage === 4) {
                    const stalk = new THREE.Mesh(wheatStalkGeo, wheatStalkMat);
                    stalk.position.y = 0.3;
                    addMesh(stalk);

                    const head = new THREE.Mesh(wheatHeadGeo, wheatHeadMat);
                    head.position.y = 0.75;
                    addMesh(head);
                }
            } else if (type === "carrot") {
                if (stage === 2) {
                    const mesh = new THREE.Mesh(
                        carrotStage2Geo,
                        carrotStage2Mat,
                    );
                    mesh.position.y = 0.15;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const mesh = new THREE.Mesh(
                        carrotStage3Geo,
                        carrotStage3Mat,
                    );
                    mesh.position.y = 0.25;
                    addMesh(mesh);
                } else if (stage === 4) {
                    const leaf = new THREE.Mesh(carrotLeafGeo, carrotLeafMat);
                    leaf.position.y = 0.3;
                    addMesh(leaf);

                    const base = new THREE.Mesh(carrotBaseGeo, carrotBaseMat);
                    base.position.y = 0.05;
                    addMesh(base);
                }
            } else if (type === "tomato") {
                if (stage === 2) {
                    const mesh = new THREE.Mesh(
                        tomatoStage2Geo,
                        tomatoStage2Mat,
                    );
                    mesh.position.y = 0.2;
                    addMesh(mesh);

                    const leaf = new THREE.Mesh(tomatoLeafGeo, tomatoStage2Mat);
                    leaf.position.set(0.1, 0.3, 0);
                    addMesh(leaf);
                } else if (stage === 3) {
                    const mesh = new THREE.Mesh(
                        tomatoStage3Geo,
                        tomatoStage3Mat,
                    );
                    mesh.position.y = 0.3;
                    addMesh(mesh);

                    const stem = new THREE.Mesh(tomatoStemGeo, tomatoStage3Mat);
                    stem.position.y = 0.15;
                    addMesh(stem);
                } else if (stage === 4) {
                    const bush = new THREE.Mesh(tomatoBushGeo, tomatoPlantMat);
                    bush.position.y = 0.4;
                    addMesh(bush);

                    const stem = new THREE.Mesh(
                        tomatoStemFinalGeo,
                        tomatoPlantMat,
                    );
                    stem.position.y = 0.2;
                    addMesh(stem);

                    const f1 = new THREE.Mesh(tomatoFruitGeo, tomatoFruitMat);
                    f1.position.set(0.2, 0.4, 0.1);
                    addMesh(f1);

                    const f2 = new THREE.Mesh(tomatoFruitGeo, tomatoFruitMat);
                    f2.position.set(-0.15, 0.5, 0.2);
                    addMesh(f2);

                    const f3 = new THREE.Mesh(tomatoFruitGeo, tomatoFruitMat);
                    f3.position.set(0.1, 0.3, -0.2);
                    addMesh(f3);
                }
            } else if (type === "pine") {
                if (stage === 2) {
                    const mesh = new THREE.Mesh(pineStage2Geo, pineMat);
                    mesh.position.y = 0.2;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const trunk = new THREE.Mesh(pineTrunkSmallGeo, trunkMat);
                    trunk.position.y = 0.15;
                    addMesh(trunk);

                    const foliage = new THREE.Mesh(
                        pineFoliageSmallGeo,
                        pineMat,
                    );
                    foliage.position.y = 0.45;
                    addMesh(foliage);
                } else if (stage === 4) {
                    const trunk = new THREE.Mesh(pineTrunkLargeGeo, trunkMat);
                    trunk.position.y = 0.2;
                    addMesh(trunk);

                    const foliage1 = new THREE.Mesh(
                        pineFoliageLarge1Geo,
                        pineMat,
                    );
                    foliage1.position.y = 0.6;
                    addMesh(foliage1);

                    const foliage2 = new THREE.Mesh(
                        pineFoliageLarge2Geo,
                        pineMat,
                    );
                    foliage2.position.y = 1.0;
                    addMesh(foliage2);
                }
            } else if (type === "oak" || type === "apple" || type === "mango") {
                if (stage === 2) {
                    const mesh = new THREE.Mesh(oakStage2Geo, oakMat);
                    mesh.position.y = 0.2;
                    addMesh(mesh);
                } else if (stage === 3) {
                    const trunk = new THREE.Mesh(oakTrunkSmallGeo, trunkMat);
                    trunk.position.y = 0.15;
                    addMesh(trunk);

                    const foliage = new THREE.Mesh(oakFoliageSmallGeo, oakMat);
                    foliage.position.y = 0.45;
                    addMesh(foliage);
                } else if (stage >= 4) {
                    const trunk = new THREE.Mesh(oakTrunkLargeGeo, trunkMat);
                    trunk.position.y = 0.25;
                    addMesh(trunk);

                    const foliage = new THREE.Mesh(oakFoliageLargeGeo, oakMat);
                    foliage.position.y = 0.65;
                    addMesh(foliage);

                    if (stage === 5) {
                        const mat =
                            type === "apple" ? appleFruitMat : mangoFruitMat;
                        const positions = [
                            [0.25, 0.6, 0.15],
                            [-0.2, 0.7, 0.2],
                            [0.1, 0.5, -0.25],
                            [-0.15, 0.8, -0.1],
                        ];

                        positions.forEach((pos) => {
                            const fruit = new THREE.Mesh(fruitGeo, mat);
                            fruit.position.set(pos[0], pos[1], pos[2]);
                            addMesh(fruit);
                        });
                    }
                }
            }

            return group;
        };

        // Initialize Grid with Grass
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
                const x = i - 5.5;
                const z = j - 5.5;

                const tile = createGrassTile(x, z);
                scene.add(tile);
                tiles.set(`${x},${z}`, tile);
            }
        }

        // Interaction Setup
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const interactionPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 12),
            new THREE.MeshBasicMaterial({ visible: false }),
        );
        interactionPlane.rotation.x = -Math.PI / 2;
        scene.add(interactionPlane);

        const highlightMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
            }),
        );
        highlightMesh.rotation.x = -Math.PI / 2;
        // default a little above the grass top (grass top center 0.15 + half-height 0.05 => 0.2)
        // add small offset so the highlight sits visibly above the tile
        highlightMesh.position.y = 0.22;
        highlightMesh.visible = false;
        scene.add(highlightMesh);

        const onMouseMove = (event: MouseEvent) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", onMouseMove);

        const onMouseClick = () => {
            if (highlightMesh.visible) {
                const x = highlightMesh.position.x;
                const z = highlightMesh.position.z;
                const key = `${x},${z}`;
                const tile = tiles.get(key);

                if (selectedSeed) {
                    if (selectedSeed === "harvest") {
                        if (tile && tile.userData.hasCrop) {
                            const cropData = crops.get(key);
                            if (
                                cropData &&
                                ["wheat", "carrot", "tomato"].includes(
                                    cropData.type,
                                ) &&
                                cropData.stage === 4
                            ) {
                                scene.remove(cropData.mesh);
                                crops.delete(key);
                                tile.userData.hasCrop = false;
                            }
                        }
                    } else if (selectedSeed === "harvest_fruit") {
                        if (tile && tile.userData.hasCrop) {
                            const cropData = crops.get(key);
                            if (
                                cropData &&
                                ["apple", "mango"].includes(cropData.type) &&
                                cropData.stage === 5
                            ) {
                                scene.remove(cropData.mesh);
                                cropData.stage = 3;
                                cropData.lastStageUpdate = performance.now();
                                const newMesh = createCrop(
                                    cropData.type,
                                    3,
                                    x,
                                    z,
                                );
                                scene.add(newMesh);
                                cropData.mesh = newMesh;
                            }
                        }
                    } else if (selectedSeed === "axe") {
                        if (tile && tile.userData.hasCrop) {
                            const cropData = crops.get(key);
                            if (cropData) {
                                const isTree = [
                                    "pine",
                                    "oak",
                                    "apple",
                                    "mango",
                                ].includes(cropData.type);
                                const maxStage = ["apple", "mango"].includes(
                                    cropData.type,
                                )
                                    ? 5
                                    : 4;
                                if (isTree && cropData.stage === maxStage) {
                                    scene.remove(cropData.mesh);
                                    crops.delete(key);
                                    tile.userData.hasCrop = false;
                                }
                            }
                        }
                    } else if (
                        ["wheat", "carrot", "tomato"].includes(selectedSeed)
                    ) {
                        if (
                            tile &&
                            tile.userData.type === "soil" &&
                            !tile.userData.hasCrop
                        ) {
                            const crop = createCrop(selectedSeed, 1, x, z);
                            scene.add(crop);
                            tile.userData.hasCrop = true;
                            crops.set(key, {
                                mesh: crop,
                                type: selectedSeed,
                                stage: 1,
                                plantedAt: performance.now(),
                                lastStageUpdate: performance.now(),
                            });
                        }
                    } else if (
                        ["pine", "oak", "apple", "mango"].includes(selectedSeed)
                    ) {
                        if (
                            tile &&
                            tile.userData.type === "grass" &&
                            !tile.userData.hasCrop
                        ) {
                            const crop = createCrop(selectedSeed, 1, x, z);
                            scene.add(crop);
                            tile.userData.hasCrop = true;
                            crops.set(key, {
                                mesh: crop,
                                type: selectedSeed,
                                stage: 1,
                                plantedAt: performance.now(),
                                lastStageUpdate: performance.now(),
                            });
                        }
                    } else if (
                        ["soil", "grass", "path"].includes(selectedSeed)
                    ) {
                        if (tile && !tile.userData.hasCrop) {
                            // Only allow changing tile if no crop is present
                            if (tile.userData.type !== selectedSeed) {
                                scene.remove(tile);
                                let newTile;
                                if (selectedSeed === "soil")
                                    newTile = createSoilTile(x, z);
                                else if (selectedSeed === "grass")
                                    newTile = createGrassTile(x, z);
                                else if (selectedSeed === "path")
                                    newTile = createPathTile(x, z);

                                if (newTile) {
                                    scene.add(newTile);
                                    tiles.set(key, newTile);
                                }
                            }
                        }
                    }
                }
            }
        };
        window.addEventListener("click", onMouseClick);

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            controls.update();

            const now = performance.now();
            crops.forEach((cropData, key) => {
                const maxStage = ["apple", "mango"].includes(cropData.type)
                    ? 5
                    : 4;
                if (cropData.stage < maxStage) {
                    let growthTime = 0;
                    if (cropData.type === "wheat") growthTime = 5000;
                    else if (cropData.type === "carrot") growthTime = 10000;
                    else if (cropData.type === "tomato") growthTime = 15000;
                    else if (
                        ["pine", "oak", "apple", "mango"].includes(
                            cropData.type,
                        )
                    )
                        growthTime = 20000;

                    if (now - cropData.lastStageUpdate > growthTime) {
                        // Upgrade stage
                        scene.remove(cropData.mesh);
                        const [xStr, zStr] = key.split(",");
                        const x = parseFloat(xStr);
                        const z = parseFloat(zStr);

                        cropData.stage++;
                        cropData.lastStageUpdate = now;

                        const newMesh = createCrop(
                            cropData.type,
                            cropData.stage,
                            x,
                            z,
                        );
                        scene.add(newMesh);
                        cropData.mesh = newMesh;
                    }
                }
            });

            // Raycasting
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(interactionPlane);

            if (intersects.length > 0) {
                const intersect = intersects[0];
                const x = Math.floor(intersect.point.x) + 0.5;
                const z = Math.floor(intersect.point.z) + 0.5;

                // Check bounds (12x12 grid centered at 0,0 means -6 to 6)
                if (x > -6 && x < 6 && z > -6 && z < 6) {
                    highlightMesh.position.x = x;
                    highlightMesh.position.z = z;

                    // set the highlight height depending on the tile type (soil vs grass)
                    const key = `${x},${z}`;
                    const tile = tiles.get(key);

                    if (tile) {
                        // soil top (center y=0.05, half-height 0.05) => top=0.1
                        // grass top center y=0.15, half-height 0.05 => top=0.2
                        // place highlight slightly above top
                        if (tile.userData.type === "grass") {
                            highlightMesh.position.y = 0.22;
                        } else if (tile.userData.type === "soil") {
                            highlightMesh.position.y = 0.12;
                        } else if (tile.userData.type === "path") {
                            highlightMesh.position.y = 0.32;
                        } else {
                            highlightMesh.position.y = 0.12;
                        }

                        highlightMesh.visible = true;
                    } else {
                        highlightMesh.visible = false;
                    }
                } else {
                    highlightMesh.visible = false;
                }
            } else {
                highlightMesh.visible = false;
            }

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
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("click", onMouseClick);
            cancelAnimationFrame(frameId);
            controls.dispose();
            renderer.dispose();

            soilGeometry.dispose();
            soilMaterial.dispose();
            grassTopGeometry.dispose();
            grassMaterial.dispose();
            pathTopGeometry.dispose();
            pathMaterial.dispose();

            sproutGeo.dispose();
            sproutMat.dispose();

            wheatStage2Geo.dispose();
            wheatStage2Mat.dispose();
            wheatStage3Geo.dispose();
            wheatStage3Mat.dispose();
            wheatStalkGeo.dispose();
            wheatStalkMat.dispose();
            wheatHeadGeo.dispose();
            wheatHeadMat.dispose();

            carrotStage2Geo.dispose();
            carrotStage2Mat.dispose();
            carrotStage3Geo.dispose();
            carrotStage3Mat.dispose();
            carrotLeafGeo.dispose();
            carrotLeafMat.dispose();
            carrotBaseGeo.dispose();
            carrotBaseMat.dispose();

            tomatoStage2Geo.dispose();
            tomatoStage2Mat.dispose();
            tomatoLeafGeo.dispose();
            tomatoStage3Geo.dispose();
            tomatoStage3Mat.dispose();
            tomatoStemGeo.dispose();
            tomatoBushGeo.dispose();
            tomatoStemFinalGeo.dispose();
            tomatoPlantMat.dispose();
            tomatoFruitGeo.dispose();
            tomatoFruitMat.dispose();

            // Tree geometries
            pineStage2Geo.dispose();
            pineTrunkSmallGeo.dispose();
            pineFoliageSmallGeo.dispose();
            pineTrunkLargeGeo.dispose();
            pineFoliageLarge1Geo.dispose();
            pineFoliageLarge2Geo.dispose();

            oakStage2Geo.dispose();
            oakTrunkSmallGeo.dispose();
            oakFoliageSmallGeo.dispose();
            oakTrunkLargeGeo.dispose();
            oakFoliageLargeGeo.dispose();
            fruitGeo.dispose();

            interactionPlane.geometry.dispose();
            (interactionPlane.material as THREE.Material).dispose();
            highlightMesh.geometry.dispose();
            (highlightMesh.material as THREE.Material).dispose();
        };
    });
</script>

<div bind:this={container} class="scene-container"></div>

<GameHUD {onBack} bind:selectedSeed />

<style>
    .scene-container {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: #111;
    }
</style>
