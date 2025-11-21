import * as THREE from 'three';
import type { GameManager } from '../GameManager';

export interface HoverState {
    visible: boolean;
    color?: number;
    scale?: number | THREE.Vector3;
    posY?: number;
    rotation?: THREE.Euler;
    x?: number;
    z?: number;
}

export interface ToolResult {
    success: boolean;
    message?: string;
    data?: any;
}

export abstract class Tool {
    protected gameManager: GameManager;

    constructor(gameManager: GameManager) {
        this.gameManager = gameManager;
    }

    abstract use(x: number, z: number, intersectedObject?: THREE.Object3D): ToolResult;

    abstract getHoverState(x: number, z: number, intersectedObject?: THREE.Object3D): HoverState;
}
