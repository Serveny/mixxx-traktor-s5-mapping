import { Button } from './buttons/button';
import { Component } from './component';

export abstract class ComponentContainer extends Component {
  constructor(group: string) {
    super(group);
  }
  *[Symbol.iterator]() {
    // can't use for...of here because it would create an infinite loop
    for (const property in this) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        const obj = this[property];
        if (obj instanceof Button) {
          yield obj;
        } else if (Array.isArray(obj)) {
          for (const objectInArray of obj) {
            if (objectInArray instanceof Button) {
              yield objectInArray;
            }
          }
        }
      }
    }
  }
  reconnectComponents(callback: (component: Button) => void) {
    for (const component of this) {
      component.outDisconnect();
      callback.call(this, component);

      component.outConnect();
      component.outTrigger();
      component.unshift();
    }
  }

  unshift() {
    for (const component of this) {
      component.unshift();
      component.isShifted = false;
    }
    this.isShifted = false;
  }
  shift() {
    for (const component of this) {
      component.shift();
      component.isShifted = true;
    }
    this.isShifted = true;
  }
}
