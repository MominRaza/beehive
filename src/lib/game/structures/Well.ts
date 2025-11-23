import * as THREE from 'three';
import { Structure } from './Structure';

export class Well extends Structure {
    constructor(x: number, z: number) {
        super(x, z);
        this.buildWell();
    }

    private buildWell() {
        // Base
        const baseGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 8);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.4;
        this.mesh.add(base);

        // Water
        const waterGeo = new THREE.CircleGeometry(0.35, 8);
        const waterMat = new THREE.MeshStandardMaterial({ color: 0x0000FF });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 0.7;
        this.mesh.add(water);

        // Roof supports
        const supportGeo = new THREE.BoxGeometry(0.05, 1, 0.05);
        const supportMat = new THREE.MeshStandardMaterial({ color: 0x4A3C31 });

        const s1 = new THREE.Mesh(supportGeo, supportMat);
        s1.position.set(-0.3, 0.9, 0);
        this.mesh.add(s1);

        const s2 = new THREE.Mesh(supportGeo, supportMat);
        s2.position.set(0.3, 0.9, 0);
        this.mesh.add(s2);

        // Roof
        const roofGeo = new THREE.ConeGeometry(0.6, 0.4, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 1.6;
        roof.rotation.y = Math.PI / 4;
        this.mesh.add(roof);
    }
}
