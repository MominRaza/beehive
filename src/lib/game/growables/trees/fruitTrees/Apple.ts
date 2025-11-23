import { FruitTree } from './FruitTree';

export class Apple extends FruitTree {
    protected getFruitName(): string {
        return "Apple";
    }
    protected getFruitColor(): number {
        return 0xFF0000; // Red
    }
}
