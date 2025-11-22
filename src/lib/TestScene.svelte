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
        ground.position.y = 0;
        scene.add(ground);

        // Cube
        const cubeGeometry = new THREE.BoxGeometry();
        const cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = -9;
        scene.add(cube);

        // Sphere
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.x = -7;
        scene.add(sphere);

        // Cone
        const coneGeometry = new THREE.ConeGeometry(0.7, 1.5, 32);
        const coneMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: true,
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.x = -5;
        scene.add(cone);

        // Torus
        const torusGeometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            wireframe: true,
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.x = -3;
        scene.add(torus);

        // Cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
        const cylinderMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.x = -1;
        scene.add(cylinder);

        // Dodecahedron
        const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.7);
        const dodecahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            wireframe: true,
        });
        const dodecahedron = new THREE.Mesh(
            dodecahedronGeometry,
            dodecahedronMaterial,
        );
        dodecahedron.position.x = 1;
        scene.add(dodecahedron);

        // TorusKnot
        const torusKnotGeometry = new THREE.TorusKnotGeometry(
            0.5,
            0.2,
            100,
            16,
        );
        const torusKnotMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8800,
            wireframe: true,
        });
        const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        torusKnot.position.x = 3;
        scene.add(torusKnot);

        // Icosahedron
        const icosahedronGeometry = new THREE.IcosahedronGeometry(0.7);
        const icosahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            wireframe: true,
        });
        const icosahedron = new THREE.Mesh(
            icosahedronGeometry,
            icosahedronMaterial,
        );
        icosahedron.position.x = 5;
        scene.add(icosahedron);

        // Octahedron
        const octahedronGeometry = new THREE.OctahedronGeometry(0.7);
        const octahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0x8800ff,
            wireframe: true,
        });
        const octahedron = new THREE.Mesh(
            octahedronGeometry,
            octahedronMaterial,
        );
        octahedron.position.x = 7;
        scene.add(octahedron);

        // Tetrahedron
        const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.7);
        const tetrahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0088,
            wireframe: true,
        });
        const tetrahedron = new THREE.Mesh(
            tetrahedronGeometry,
            tetrahedronMaterial,
        );
        tetrahedron.position.x = 9;
        scene.add(tetrahedron);

        camera.position.z = 12;

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            sphere.rotation.x += 0.01;
            sphere.rotation.y += 0.01;

            cone.rotation.x += 0.01;
            cone.rotation.y += 0.01;

            torus.rotation.x += 0.01;
            torus.rotation.y += 0.01;

            cylinder.rotation.x += 0.01;
            cylinder.rotation.y += 0.01;

            dodecahedron.rotation.x += 0.01;
            dodecahedron.rotation.y += 0.01;

            torusKnot.rotation.x += 0.01;
            torusKnot.rotation.y += 0.01;

            icosahedron.rotation.x += 0.01;
            icosahedron.rotation.y += 0.01;

            octahedron.rotation.x += 0.01;
            octahedron.rotation.y += 0.01;

            tetrahedron.rotation.x += 0.01;
            tetrahedron.rotation.y += 0.01;

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

            cubeGeometry.dispose();
            cubeMaterial.dispose();
            sphereGeometry.dispose();
            sphereMaterial.dispose();
            coneGeometry.dispose();
            coneMaterial.dispose();
            torusGeometry.dispose();
            torusMaterial.dispose();
            cylinderGeometry.dispose();
            cylinderMaterial.dispose();
            dodecahedronGeometry.dispose();
            dodecahedronMaterial.dispose();
            torusKnotGeometry.dispose();
            torusKnotMaterial.dispose();
            icosahedronGeometry.dispose();
            icosahedronMaterial.dispose();
            octahedronGeometry.dispose();
            octahedronMaterial.dispose();
            tetrahedronGeometry.dispose();
            tetrahedronMaterial.dispose();
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
