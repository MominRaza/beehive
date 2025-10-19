import * as THREE from 'three';

/**
 * Create a low-poly tool model
 */
export function createToolModel(toolType: string): THREE.Group {
    const group = new THREE.Group();

    switch (toolType) {
        case 'hoe':
            // Handle
            const hoeHandleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6);
            const hoeHandleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const hoeHandle = new THREE.Mesh(hoeHandleGeometry, hoeHandleMaterial);
            hoeHandle.position.y = 0.3;
            group.add(hoeHandle);

            // Blade
            const hoeBladeGeometry = new THREE.BoxGeometry(0.2, 0.02, 0.05);
            const hoeBladeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
            const hoeBlade = new THREE.Mesh(hoeBladeGeometry, hoeBladeMaterial);
            hoeBlade.position.y = 0.05;
            hoeBlade.rotation.x = Math.PI / 4;
            group.add(hoeBlade);
            break;

        case 'watering_can':
            // Body
            const canBodyGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.2, 8);
            const canBodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4682b4 });
            const canBody = new THREE.Mesh(canBodyGeometry, canBodyMaterial);
            canBody.position.y = 0.1;
            group.add(canBody);

            // Spout
            const spoutGeometry = new THREE.CylinderGeometry(0.02, 0.03, 0.15, 6);
            const spoutMaterial = new THREE.MeshStandardMaterial({ color: 0x4682b4 });
            const spout = new THREE.Mesh(spoutGeometry, spoutMaterial);
            spout.position.set(0.1, 0.15, 0);
            spout.rotation.z = Math.PI / 3;
            group.add(spout);
            break;

        case 'scythe':
            // Handle
            const scytheHandleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6);
            const scytheHandleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const scytheHandle = new THREE.Mesh(scytheHandleGeometry, scytheHandleMaterial);
            scytheHandle.position.y = 0.35;
            group.add(scytheHandle);

            // Blade
            const scytheBladeGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.05);
            const scytheBladeMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
            const scytheBlade = new THREE.Mesh(scytheBladeGeometry, scytheBladeMaterial);
            scytheBlade.position.set(0.1, 0.7, 0);
            scytheBlade.rotation.z = -Math.PI / 6;
            group.add(scytheBlade);
            break;
    }

    group.scale.set(0.5, 0.5, 0.5);
    return group;
}

/**
 * Create particle effect for actions
 */
export function createParticles(count: number, color: number): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
    });

    return new THREE.Points(geometry, material);
}
