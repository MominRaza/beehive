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

        // Tile Materials & Geometry (From TestScene)
        const soilGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const soilMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 }); // SaddleBrown

        const grassTopGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 }); // ForestGreen

        // Crop Geometries & Materials
        const wheatStalkGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const wheatStalkMat = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
        const wheatHeadGeo = new THREE.BoxGeometry(0.15, 0.3, 0.15);
        const wheatHeadMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });

        const carrotLeafGeo = new THREE.ConeGeometry(0.3, 0.6, 8);
        const carrotLeafMat = new THREE.MeshBasicMaterial({ color: 0x228b22 });
        const carrotBaseGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.1);
        const carrotBaseMat = new THREE.MeshBasicMaterial({ color: 0xff8c00 });

        const tomatoBushGeo = new THREE.DodecahedronGeometry(0.3);
        const tomatoStemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
        const tomatoPlantMat = new THREE.MeshBasicMaterial({ color: 0x228b22 });
        const tomatoFruitGeo = new THREE.SphereGeometry(0.08);
        const tomatoFruitMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        const tiles = new Map<string, THREE.Object3D>();

        const createSoilTile = (x: number, z: number) => {
            const mesh = new THREE.Mesh(soilGeometry, soilMaterial);
            mesh.position.set(x, 0.05, z);
            mesh.userData = { type: "soil" };
            return mesh;
        };

        const createGrassTile = (x: number, z: number) => {
            const group = new THREE.Group();

            const soilMesh = new THREE.Mesh(soilGeometry, soilMaterial);
            soilMesh.position.y = 0.05;
            group.add(soilMesh);

            const grassMesh = new THREE.Mesh(grassTopGeometry, grassMaterial);
            grassMesh.position.y = 0.15;
            group.add(grassMesh);

            group.position.set(x, 0, z);
            group.userData = { type: "grass" };
            return group;
        };

        const createCrop = (type: string, x: number, z: number) => {
            const group = new THREE.Group();
            group.position.set(x, 0.1, z);

            if (type === "wheat") {
                const stalk = new THREE.Mesh(wheatStalkGeo, wheatStalkMat);
                stalk.position.y = 0.3;
                group.add(stalk);

                const head = new THREE.Mesh(wheatHeadGeo, wheatHeadMat);
                head.position.y = 0.75;
                group.add(head);
            } else if (type === "carrot") {
                const leaf = new THREE.Mesh(carrotLeafGeo, carrotLeafMat);
                leaf.position.y = 0.3;
                group.add(leaf);

                const base = new THREE.Mesh(carrotBaseGeo, carrotBaseMat);
                base.position.y = 0.05;
                group.add(base);
            } else if (type === "tomato") {
                const bush = new THREE.Mesh(tomatoBushGeo, tomatoPlantMat);
                bush.position.y = 0.4;
                group.add(bush);

                const stem = new THREE.Mesh(tomatoStemGeo, tomatoPlantMat);
                stem.position.y = 0.2;
                group.add(stem);

                const f1 = new THREE.Mesh(tomatoFruitGeo, tomatoFruitMat);
                f1.position.set(0.2, 0.4, 0.1);
                group.add(f1);

                const f2 = new THREE.Mesh(tomatoFruitGeo, tomatoFruitMat);
                f2.position.set(-0.15, 0.5, 0.2);
                group.add(f2);

                const f3 = new THREE.Mesh(tomatoFruitGeo, tomatoFruitMat);
                f3.position.set(0.1, 0.3, -0.2);
                group.add(f3);
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
                    if (
                        tile &&
                        tile.userData.type === "soil" &&
                        !tile.userData.hasCrop
                    ) {
                        const crop = createCrop(selectedSeed, x, z);
                        scene.add(crop);
                        tile.userData.hasCrop = true;
                    }
                } else {
                    if (tile && tile.userData.type === "grass") {
                        // Remove grass tile
                        scene.remove(tile);

                        // Add soil tile
                        const soilTile = createSoilTile(x, z);
                        scene.add(soilTile);
                        tiles.set(key, soilTile);
                    }
                }
            }
        };
        window.addEventListener("click", onMouseClick);

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            controls.update();

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

            wheatStalkGeo.dispose();
            wheatStalkMat.dispose();
            wheatHeadGeo.dispose();
            wheatHeadMat.dispose();
            carrotLeafGeo.dispose();
            carrotLeafMat.dispose();
            carrotBaseGeo.dispose();
            carrotBaseMat.dispose();
            tomatoBushGeo.dispose();
            tomatoStemGeo.dispose();
            tomatoPlantMat.dispose();
            tomatoFruitGeo.dispose();
            tomatoFruitMat.dispose();

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
