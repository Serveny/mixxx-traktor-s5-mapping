import type { MixxxGroup } from '../types/mixxx-controls';
import { Button } from './buttons/button';
import { ShiftMixin, GroupComponent } from './component';

export abstract class ComponentContainer<TGroup> extends ShiftMixin(
  GroupComponent<MixxxGroup>
) {
  constructor(group: TGroup) {
    super({ group });
  }
  *[Symbol.iterator]() {
    // can't use for...of here because it would create an infinite loop
    for (const property in this) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        const obj: any = this[property];
        if (obj?.shift != null) {
          yield obj;
        } else if (Array.isArray(obj)) {
          for (const objectInArray of obj) {
            if (objectInArray?.shift != null) {
              yield objectInArray;
            }
          }
        }
      }
    }
  }
  reconnectComponents(callback: (component: Button) => void) {
    for (const component of this) {
      component.outDisconnect?.();
      callback.call(this, component);

      component.outConnect?.();
      component.outTrigger?.();
      component.unshift?.();
    }
  }

  onUnshift() {
    for (const component of this) component.unshift();
  }

  onShift() {
    for (const component of this) component.shift();
  }
}

// Factory to keep TGroup (can't give TGroup into GroupComponent)
export function createCompContainer<TGroup extends MixxxGroup>() {
  return ComponentContainer<TGroup>;
}
