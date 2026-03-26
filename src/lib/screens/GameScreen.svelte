<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { AmbientLight, Color, IcosahedronGeometry, Mesh, MeshStandardMaterial, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
  import Button from '../components/Button.svelte';

  interface Props {
    onMenu: () => void;
  }

  let { onMenu }: Props = $props();

  let canvas: HTMLCanvasElement = $state()!;
  let renderer: WebGLRenderer;
  let animId: number;

  onMount(() => {
    // Scene
    const scene = new Scene();

    // Camera
    const camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);

    // Renderer
    renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0d0d0d);

    // Resolve design tokens from CSS
    const style = getComputedStyle(document.documentElement);
    const accent = new Color(style.getPropertyValue('--accent').trim());
    const bg = new Color(style.getPropertyValue('--bg').trim());
    renderer.setClearColor(bg);

    // Lights
    const ambient = new AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const point = new PointLight(accent, 80, 20);
    point.position.set(3, 3, 3);
    scene.add(point);

    // Mesh
    const geometry = new IcosahedronGeometry(1.2, 0);
    const material = new MeshStandardMaterial({
      color: accent,
      wireframe: false,
      roughness: 0.4,
      metalness: 0.6,
    });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Loop
    const tick = () => {
      animId = requestAnimationFrame(tick);
      mesh.rotation.x += 0.03;
      mesh.rotation.y += 0.05;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
    renderer?.dispose();
  });
</script>

<div class="game">
  <canvas bind:this={canvas}></canvas>

  <div class="hud">
    <span class="score">0</span>
    <Button variant="icon" onclick={onMenu}>✕</Button>
  </div>
</div>

<style>
  .game {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .hud {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
  }

  .hud > :global(*) {
    pointer-events: all;
  }

  .score {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: 0.05em;
  }
</style>
