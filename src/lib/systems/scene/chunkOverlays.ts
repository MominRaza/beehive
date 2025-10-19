import * as THREE from "three";
import type { GameState, Chunk } from "../../stores/farm";
import { CHUNK_SIZE, isChunkOrthogonallyAdjacent } from "../../stores/farm";

export interface ChunkCacheEntry {
    group: THREE.Group;
    isAvailable: boolean;
}

export interface ChunkSyncContext {
    scene: THREE.Scene;
    state: GameState;
    chunkObjects: Map<string, THREE.Object3D>;
    chunkCache: Map<string, ChunkCacheEntry>;
    hoveredChunkId: string | null;
}

export function syncChunkOverlays({
    scene,
    state,
    chunkObjects,
    chunkCache,
    hoveredChunkId,
}: ChunkSyncContext): string | null {
    chunkObjects.clear();
    const nextChunkIds = new Set<string>();

    state.chunks.forEach((chunk) => {
        if (chunk.isOwned) {
            removeChunk(scene, chunkCache, chunk.id);
            return;
        }

        nextChunkIds.add(chunk.id);
        const isAvailable = isChunkOrthogonallyAdjacent(state.chunks, chunk);
        const cached = chunkCache.get(chunk.id);

        if (!cached) {
            const group = createChunkOverlay(chunk, isAvailable);
            scene.add(group);
            chunkCache.set(chunk.id, { group, isAvailable });
            chunkObjects.set(chunk.id, group);
            return;
        }

        updateChunkOverlay(cached, chunk, isAvailable);
        chunkObjects.set(chunk.id, cached.group);
    });

    for (const key of Array.from(chunkCache.keys())) {
        if (!nextChunkIds.has(key)) {
            removeChunk(scene, chunkCache, key);
        }
    }

    if (hoveredChunkId && !chunkCache.has(hoveredChunkId)) {
        return null;
    }

    return hoveredChunkId;
}

function createChunkOverlay(chunk: Chunk, isAvailable: boolean): THREE.Group {
    const group = new THREE.Group();
    const fillGeometry = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE);
    const fillMaterial = new THREE.MeshStandardMaterial({
        color: getChunkFillColor(isAvailable),
        transparent: true,
        opacity: isAvailable ? 0.35 : 0.2,
        side: THREE.DoubleSide,
    });
    const fill = new THREE.Mesh(fillGeometry, fillMaterial);
    fill.rotation.x = -Math.PI / 2;
    fill.position.y = 0.05;
    group.add(fill);

    const edgeGeometry = new THREE.EdgesGeometry(fillGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
        color: getChunkOutlineColor(isAvailable),
        transparent: true,
        opacity: 0.6,
    });
    const outline = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    outline.rotation.x = -Math.PI / 2;
    outline.position.y = 0.051;
    group.add(outline);

    const center = getChunkCenter(chunk);
    group.position.set(center.x, 0, center.z);
    group.userData = { chunkId: chunk.id, fill, outline };

    return group;
}

function updateChunkOverlay(
    entry: ChunkCacheEntry,
    chunk: Chunk,
    isAvailable: boolean,
): void {
    const center = getChunkCenter(chunk);
    entry.group.position.set(center.x, 0, center.z);

    const fill = entry.group.userData.fill as THREE.Mesh | undefined;
    const outline = entry.group.userData.outline as THREE.LineSegments | undefined;

    if (fill) {
        const material = fill.material as THREE.MeshStandardMaterial;
        material.color.setHex(getChunkFillColor(isAvailable));
        material.opacity = isAvailable ? 0.35 : 0.2;
        material.needsUpdate = true;
    }

    if (outline) {
        const material = outline.material as THREE.LineBasicMaterial;
        material.color.setHex(getChunkOutlineColor(isAvailable));
        material.opacity = 0.6;
        material.needsUpdate = true;
    }

    entry.isAvailable = isAvailable;
    entry.group.userData.chunkId = chunk.id;
}

const chunkCenterOffset = (CHUNK_SIZE - 1) / 2 - Math.floor(CHUNK_SIZE / 2);

function getChunkCenter(chunk: Chunk) {
    return {
        x: chunk.x * CHUNK_SIZE + chunkCenterOffset,
        z: chunk.z * CHUNK_SIZE + chunkCenterOffset,
    };
}

function getChunkFillColor(isAvailable: boolean): number {
    return isAvailable ? 0x2563eb : 0x374151;
}

function getChunkOutlineColor(isAvailable: boolean): number {
    return isAvailable ? 0xfacc15 : 0x94a3b8;
}

function removeChunk(
    scene: THREE.Scene,
    chunkCache: Map<string, ChunkCacheEntry>,
    chunkId: string,
): void {
    const cached = chunkCache.get(chunkId);
    if (!cached) return;
    scene.remove(cached.group);
    chunkCache.delete(chunkId);
}
