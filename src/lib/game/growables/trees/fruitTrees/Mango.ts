import { FruitTree } from './FruitTree';

export class Mango extends FruitTree {
    getFruitName(): string {
        return "Mango";
    }
    getFruitColor(): number {
        return 0xFFD700; // Gold/Yellow
    }
}
