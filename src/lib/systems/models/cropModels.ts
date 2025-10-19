import * as THREE from 'three';

/**
 * Create a low-poly crop model based on growth stage
 */
export function createCropModel(cropType: string, stage: number): THREE.Group {
    const group = new THREE.Group();

    // Different crop appearances based on type
    const cropColors: Record<string, number> = {
        wheat: 0xf4a460,
        carrot: 0xff8c00,
        tomato: 0xff6347,
        corn: 0xffd700,
        potato: 0xd2b48c,
        pumpkin: 0xff8c00,
    };

    const color = cropColors[cropType] || 0x90ee90;

    // Scale based on growth stage (0-1)
    const scale = 0.2 + stage * 0.6;

    if (cropType === 'wheat' || cropType === 'corn') {
        // Tall crops
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, scale, 6);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = scale / 2;
        stem.castShadow = true;
        group.add(stem);

        if (stage > 0.5) {
            // Add head when mature
            const headGeometry = new THREE.SphereGeometry(0.1 * scale, 6, 6);
            const headMaterial = new THREE.MeshStandardMaterial({ color });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = scale;
            head.castShadow = true;
            group.add(head);
        }
    } else if (cropType === 'pumpkin') {
        // Ground crops
        const bodyGeometry = new THREE.SphereGeometry(0.15 * scale, 8, 6);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.y = 0.7;
        body.position.y = 0.1 * scale;
        body.castShadow = true;
        group.add(body);

        if (stage > 0.7) {
            // Add stem
            const stemGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.1 * scale, 6);
            const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            stem.position.y = 0.15 * scale;
            group.add(stem);
        }
    } else {
        // Root vegetables and tomatoes
        const leavesGeometry = new THREE.ConeGeometry(0.1 * scale, 0.15 * scale, 6);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 0.075 * scale;
        leaves.castShadow = true;
        group.add(leaves);

        if (stage > 0.6) {
            // Add vegetable/fruit
            const vegetableGeometry = new THREE.SphereGeometry(0.06 * scale, 6, 6);
            const vegetableMaterial = new THREE.MeshStandardMaterial({ color });
            const vegetable = new THREE.Mesh(vegetableGeometry, vegetableMaterial);
            vegetable.position.y = 0.05 * scale;
            vegetable.castShadow = true;
            group.add(vegetable);
        }
    }

    return group;
}
