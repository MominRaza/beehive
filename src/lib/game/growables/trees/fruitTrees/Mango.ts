import { FruitTree } from './FruitTree';

export class Mango extends FruitTree {
    protected getFruitName(): string {
        return "Mango";
    }
    protected getFruitColor(): number {
        return 0xFFD700; // Gold/Yellow
    }
}
