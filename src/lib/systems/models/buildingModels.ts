import * as THREE from 'three';

/**
 * Create a low-poly building model
 */
export function createBuildingModel(buildingType: string): THREE.Group {
    const group = new THREE.Group();

    if (buildingType === 'seed_storage') {
        // Small shed
        const wallsGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.8);
        const wallsMaterial = new THREE.MeshStandardMaterial({ color: 0xd2691e });
        const walls = new THREE.Mesh(wallsGeometry, wallsMaterial);
        walls.position.y = 0.3;
        walls.castShadow = true;
        group.add(walls);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(0.6, 0.3, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 0.75;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
    } else if (buildingType === 'barn') {
        // Large barn
        const wallsGeometry = new THREE.BoxGeometry(1.2, 0.8, 1.0);
        const wallsMaterial = new THREE.MeshStandardMaterial({ color: 0xdc143c });
        const walls = new THREE.Mesh(wallsGeometry, wallsMaterial);
        walls.position.y = 0.4;
        walls.castShadow = true;
        group.add(walls);

        // Roof
        const roofGeometry = new THREE.BoxGeometry(1.3, 0.1, 1.1);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x4b0000 });
        const roof1 = new THREE.Mesh(roofGeometry, roofMaterial);
        roof1.position.y = 0.85;
        roof1.rotation.z = Math.PI / 6;
        roof1.castShadow = true;
        group.add(roof1);

        const roof2 = new THREE.Mesh(roofGeometry, roofMaterial);
        roof2.position.y = 0.85;
        roof2.rotation.z = -Math.PI / 6;
        roof2.castShadow = true;
        group.add(roof2);
    } else if (buildingType === 'well') {
        // Well structure
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8);
        const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.2;
        base.castShadow = true;
        group.add(base);

        // Roof support
        const postGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6);
        const postMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

        const post1 = new THREE.Mesh(postGeometry, postMaterial);
        post1.position.set(-0.25, 0.5, 0);
        group.add(post1);

        const post2 = new THREE.Mesh(postGeometry, postMaterial);
        post2.position.set(0.25, 0.5, 0);
        group.add(post2);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(0.35, 0.25, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 0.9;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
    }

    return group;
}
