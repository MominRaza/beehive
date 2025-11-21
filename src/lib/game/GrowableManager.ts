import { ObjectManager } from './ObjectManager';
import { GrowableObject } from './objects/GrowableObject';

export abstract class GrowableManager<T extends GrowableObject> extends ObjectManager<T> {
    update(deltaTime: number) {
        this.objects.forEach((obj) => {
            obj.update(deltaTime);
        });
    }

    updateVisuals(obj: T) {
        obj.updateVisuals();
    }
}
