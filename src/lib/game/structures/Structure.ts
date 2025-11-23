import { GameObject } from '../GameObject';

export abstract class Structure extends GameObject {
    public width: number;
    public depth: number;

    constructor(x: number, z: number, width: number = 1, depth: number = 1) {
        super(x, z);
        this.width = width;
        this.depth = depth;
    }
}
