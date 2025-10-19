import * as THREE from 'three';

/**
 * Create a low-poly tree model based on type and growth stage
 */
export function createTreeModel(treeType: string, stage: number): THREE.Group {
    const group = new THREE.Group();

    // Scale based on growth stage (0-1)
    const scale = 0.3 + stage * 0.7;

    // Tree colors
    const trunkColor = 0x8b4513;
    const pineColor = 0x228b22;
    const oakColor = 0x2d5016;
    const fruitTreeColor = 0x90ee90;

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.1 * scale, 0.15 * scale, 0.8 * scale, 6);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: trunkColor });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.4 * scale;
    trunk.castShadow = true;
    group.add(trunk);

    if (treeType === 'pine') {
        // Pine tree - cone shape
        const foliageGeometry = new THREE.ConeGeometry(0.4 * scale, 0.8 * scale, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: pineColor });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 1.2 * scale;
        foliage.castShadow = true;
        group.add(foliage);
    } else if (treeType === 'oak') {
        // Oak tree - round canopy
        const foliageGeometry = new THREE.SphereGeometry(0.5 * scale, 8, 6);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: oakColor });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 1.2 * scale;
        foliage.castShadow = true;
        group.add(foliage);
    } else if (treeType === 'apple' || treeType === 'orange') {
        // Fruit tree - round canopy with fruit
        const foliageGeometry = new THREE.SphereGeometry(0.45 * scale, 8, 6);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: fruitTreeColor });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 1.1 * scale;
        foliage.castShadow = true;
        group.add(foliage);

        // Add fruit if mature
        if (stage >= 1) {
            const fruitColor = treeType === 'apple' ? 0xff0000 : 0xffa500;
            const fruitCount = 3;
            for (let i = 0; i < fruitCount; i++) {
                const angle = (i / fruitCount) * Math.PI * 2;
                const fruitGeometry = new THREE.SphereGeometry(0.06 * scale, 6, 6);
                const fruitMaterial = new THREE.MeshStandardMaterial({ color: fruitColor });
                const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
                fruit.position.set(
                    Math.cos(angle) * 0.3 * scale,
                    1.1 * scale + Math.sin(angle * 2) * 0.1 * scale,
                    Math.sin(angle) * 0.3 * scale
                );
                fruit.castShadow = true;
                group.add(fruit);
            }
        }
    }

    return group;
}
