import { Tile } from './Tile';

export class Soil extends Tile {
    constructor(x: number, z: number) {
        super(x, z);
        // Just the base soil from Tile
    }
}
