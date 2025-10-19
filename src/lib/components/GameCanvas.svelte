<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import {
        type GameState,
        gameState,
        isChunkOrthogonallyAdjacent,
    } from "../stores/farm";
    import { startFarmingLoop } from "../systems/farming";
    import {
        createGround,
        createScene,
        handleResize,
        setupLighting,
    } from "../systems/scene";
    import { createSelectionHighlight } from "../systems/models";
    import { createInputHandler, getCursorStyle } from "../systems/input";
    import {
        type ChunkCacheEntry,
        syncChunkOverlays,
    } from "../systems/scene/chunkOverlays";
    import {
        clearAllCaches,
        type CacheEntry,
        type CropCacheEntry,
        type PlaceableCacheEntry,
    } from "./canvas/canvasCache";
    import { updateFences } from "./canvas/canvasFence";
    import { syncTiles, syncPlaceables } from "./canvas/canvasSync";

    let canvas: HTMLCanvasElement;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationFrameId = 0;
    let cleanupFarmingLoop: (() => void) | null = null;
    let inputHandler: ReturnType<typeof createInputHandler> | null = null;
    let unsubscribeGameState: (() => void) | null = null;
    let latestState: GameState | null = null;

    const tileObjects = new Map<number, THREE.Object3D>();
    const placeableObjects = new Map<number, THREE.Object3D>();
    const chunkObjects = new Map<string, THREE.Object3D>();
    const tileCache = new Map<string, CacheEntry>();
    const cropCache = new Map<string, CropCacheEntry>();
    const placeableCache = new Map<string, PlaceableCacheEntry>();
    const chunkCache = new Map<string, ChunkCacheEntry>();
    const fenceCache = new Map<string, THREE.Group>();

    let selectionHighlight: THREE.Mesh | null = null;
    let hoveredTileIndex: number | null = null;
    let hoveredChunkId: string | null = null;

    onMount(() => {
        const sceneSetup = createScene(canvas);
        scene = sceneSetup.scene;
        camera = sceneSetup.camera;
        renderer = sceneSetup.renderer;

        setupLighting(scene);
        createGround(scene);

        selectionHighlight = createSelectionHighlight();
        scene.add(selectionHighlight);

        inputHandler = createInputHandler(
            canvas,
            camera,
            scene,
            tileObjects,
            placeableObjects,
            chunkObjects,
            (tileIndex) => {
                hoveredTileIndex = tileIndex;
                updateSelectionHighlight();
            },
            (chunkId) => {
                hoveredChunkId = chunkId;
                if (chunkId !== null) {
                    hoveredTileIndex = null;
                }
                updateSelectionHighlight();
            },
        );

        const resizeHandler = () => handleResize(camera, renderer, canvas);
        window.addEventListener("resize", resizeHandler);

        cleanupFarmingLoop = startFarmingLoop();

        unsubscribeGameState = gameState.subscribe((state) => {
            latestState = state;
            syncScene(state);
        });

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resizeHandler);
            disposeScene();
        };
    });

    function disposeScene() {
        if (cleanupFarmingLoop) {
            cleanupFarmingLoop();
            cleanupFarmingLoop = null;
        }
        if (inputHandler) {
            inputHandler.cleanup();
            inputHandler = null;
        }
        if (unsubscribeGameState) {
            unsubscribeGameState();
            unsubscribeGameState = null;
        }
        cancelAnimationFrame(animationFrameId);
        clearCachedObjects();
        renderer?.dispose();
    }

    function clearCachedObjects() {
        tileObjects.clear();
        placeableObjects.clear();
        chunkObjects.clear();

        clearAllCaches(
            scene,
            tileCache,
            cropCache,
            placeableCache,
            chunkCache,
            fenceCache,
            selectionHighlight,
        );

        selectionHighlight = null;
        hoveredTileIndex = null;
        hoveredChunkId = null;
    }

    function syncScene(state: GameState) {
        if (!scene) return;

        syncTiles(state, scene, tileObjects, tileCache, cropCache);
        syncPlaceables(state, scene, placeableObjects, placeableCache);

        hoveredChunkId = syncChunkOverlays({
            scene,
            state,
            chunkObjects,
            chunkCache,
            hoveredChunkId,
        });
        updateFences(state, scene, fenceCache);
        updateSelectionHighlight();
    }

    function updateSelectionHighlight() {
        if (!selectionHighlight || !latestState) return;

        if (
            hoveredTileIndex !== null &&
            hoveredTileIndex >= 0 &&
            hoveredTileIndex < latestState.tiles.length
        ) {
            const tile = latestState.tiles[hoveredTileIndex];
            selectionHighlight.position.set(tile.x, 0, tile.z);
            selectionHighlight.visible = true;
        } else {
            selectionHighlight.visible = false;
        }
    }

    $: chunkCursorStyle = (() => {
        if (!hoveredChunkId || !latestState) return null;
        const chunk = latestState.chunks.find((c) => c.id === hoveredChunkId);
        if (!chunk || chunk.isOwned) return null;
        return isChunkOrthogonallyAdjacent(latestState.chunks, chunk)
            ? "pointer"
            : "not-allowed";
    })();

    $: cursorStyle =
        chunkCursorStyle ??
        getCursorStyle(
            hoveredTileIndex,
            latestState?.selectedSeed ?? null,
            latestState?.selectedTool ?? null,
            latestState?.selectedTree ?? null,
            latestState?.selectedBuilding ?? null,
        );
</script>

<canvas bind:this={canvas} style="cursor: {cursorStyle};"></canvas>

<style>
    canvas {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
