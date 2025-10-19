import type { Chunk, FarmTile, GameState } from './farmTypes';

// ========== XP and Level System ==========

export function calculateLevelFromXP(xp: number): number {
    // Level = floor(sqrt(xp / 10)) + 1
    return Math.floor(Math.sqrt(xp / 10)) + 1;
}

export function calculateXPForNextLevel(currentLevel: number): number {
    // XP needed for next level = (level)^2 * 10
    return currentLevel * currentLevel * 10;
}

// ========== Chunk Helpers ========== 

export function isChunkOrthogonallyAdjacent(chunks: Chunk[], target: Chunk): boolean {
    return chunks.some(
        (chunk) =>
            chunk.isOwned &&
            Math.abs(chunk.x - target.x) + Math.abs(chunk.z - target.z) === 1,
    );
}

export const CHUNK_SIZE = 10; // Each chunk is 10x10 tiles

export function createInitialState(): GameState {
    const gridSize = 10; // Start with 10x10 grid (1 chunk)
    const tiles: FarmTile[] = [];
    const chunks: Chunk[] = [];

    // Create initial chunk (0, 0) - owned
    chunks.push({
        id: '0,0',
        x: 0,
        z: 0,
        isOwned: true,
        cost: 0,
    });

    // Create tiles for initial chunk
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            tiles.push({
                x: x - Math.floor(gridSize / 2),
                z: z - Math.floor(gridSize / 2),
                isPlowed: false,
                crop: null,
                isLocked: false,
                chunkId: '0,0',
            });
        }
    }

    // Create surrounding locked chunks
    for (let cx = -1; cx <= 1; cx++) {
        for (let cz = -1; cz <= 1; cz++) {
            if (cx === 0 && cz === 0) continue; // Skip center (owned)
            const chunkId = `${cx},${cz}`;
            const distance = Math.abs(cx) + Math.abs(cz);
            chunks.push({
                id: chunkId,
                x: cx,
                z: cz,
                isOwned: false,
                cost: 500 * distance,
            });

            // Create locked tiles for this chunk
            for (let x = 0; x < CHUNK_SIZE; x++) {
                for (let z = 0; z < CHUNK_SIZE; z++) {
                    tiles.push({
                        x: cx * CHUNK_SIZE + x - Math.floor(CHUNK_SIZE / 2),
                        z: cz * CHUNK_SIZE + z - Math.floor(CHUNK_SIZE / 2),
                        isPlowed: false,
                        crop: null,
                        isLocked: true,
                        chunkId,
                    });
                }
            }
        }
    }

    return {
        coins: 5000, // Starting coins (increased for testing)
        xp: 250, // Starting XP (increased for testing)
        level: 5, // Starting level (increased for testing)
        gridSize,
        tiles,
        chunks,
        inventory: {
            seeds: {},
            wood: 50, // Start with some wood for testing
            food: {},
        },
        placeables: [],
        selectedTileIndex: null,
        selectedSeed: null,
        selectedTool: 'hoe', // Start with hoe selected
        selectedTree: null,
        selectedBuilding: null,
        selectedChunkId: null,
        ownedTools: ['hoe', 'axe'], // Start with hoe and axe for testing
        lastUpdateTime: Date.now(),
    };
}
