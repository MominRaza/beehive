import { FruitTree } from './FruitTree';

export class Apple extends FruitTree {
    getFruitName(): string {
        return "Apple";
    }
    getFruitColor(): number {
        return 0xFF0000; // Red
    }
}
