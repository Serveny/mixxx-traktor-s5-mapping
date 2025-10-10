import type { ControlOptions } from '../types/component';
import type { MixxxGroup } from '../types/mixxx-controls';
import { Button } from './buttons/button';
import { ShiftMixin, ControlComponent } from './component';

export abstract class ComponentContainer<
  TGroup extends MixxxGroup
> extends ShiftMixin(ControlComponent<MixxxGroup, ControlOptions<MixxxGroup>>) {
  constructor(group: TGroup) {
    super({ group });
  }
  *[Symbol.iterator]() {
    // can't use for...of here because it would create an infinite loop
    for (const property in this) {
      if (!Object.prototype.hasOwnProperty.call(this, property)) continue;
      const obj: any = this[property];
      if (obj?.shift != null) yield obj;
      else if (Array.isArray(obj)) {
        for (const objectInArray of obj) {
          if (objectInArray?.shift != null) yield objectInArray;
        }
      }
    }
  }
  reconnectComponents(callback?: (component: Button) => boolean) {
    for (const component of this) {
      if (callback) if (!callback.call(this, component)) continue;
      component.outDisconnect?.();
      component.outConnect?.();
      component.outTrigger?.();
    }
  }

  triggerComponents() {
    this.callAll('outTrigger');
  }

  onShift() {
    this.callAll('shift');
  }

  onUnshift() {
    this.callAll('unshift');
  }

  private callAll(fnName: string) {
    for (const component of this) {
      if (component[fnName] !== undefined) component[fnName]();
      else if (Array.isArray(component))
        component.forEach((c) => c[fnName]?.());
    }
  }
}

// Factory to keep TGroup (can't give TGroup into GroupComponent)
export function createCompContainer<TGroup extends MixxxGroup>() {
  return ComponentContainer<TGroup>;
}
