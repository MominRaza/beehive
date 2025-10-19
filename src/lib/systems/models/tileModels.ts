import * as THREE from 'three';

/**
 * Create a low-poly farm tile
 */
export function createFarmTile(x: number, z: number, isPlowed: boolean = false): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Base tile
    const tileGeometry = new THREE.BoxGeometry(0.95, 0.05, 0.95);
    const tileMaterial = new THREE.MeshStandardMaterial({
        color: isPlowed ? 0x8b4513 : 0x7cfc00, // Brown if plowed, lawn green otherwise
        roughness: 0.9,
        metalness: 0.1,
    });
    const tile = new THREE.Mesh(tileGeometry, tileMaterial);
    tile.castShadow = true;
    tile.receiveShadow = true;
    group.add(tile);

    // Border for plowed tiles
    if (isPlowed) {
        const borderGeometry = new THREE.BoxGeometry(1, 0.06, 1);
        const borderMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.95,
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.y = -0.005;
        group.add(border);
    }

    return group;
}

/**
 * Create selection highlight for a tile
 */
export function createSelectionHighlight(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1.05, 0.15, 1.05);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.3,
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
    });
    const highlight = new THREE.Mesh(geometry, material);
    highlight.visible = false;
    return highlight;
}

/**
 * Create a locked chunk indicator
 */
export function createLockedChunkIndicator(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
    const material = new THREE.MeshStandardMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.5,
    });
    const indicator = new THREE.Mesh(geometry, material);

    // Add lock icon (simple cube for now)
    const lockGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
    const lockMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const lock = new THREE.Mesh(lockGeometry, lockMaterial);
    lock.position.y = 0.2;
    indicator.add(lock);

    return indicator;
}
