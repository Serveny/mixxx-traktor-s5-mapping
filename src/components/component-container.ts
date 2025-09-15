import { Button } from './buttons/button';
import { Component, ComponentInOut } from './component';

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
      if (
        typeof component.outDisconnect === 'function' &&
        component.outDisconnect.length === 0
      ) {
        component.outDisconnect();
      }
      if (typeof callback === 'function' && callback.length === 1) {
        callback.call(this, component);
      }
      if (
        typeof component.outConnect === 'function' &&
        component.outConnect.length === 0
      ) {
        component.outConnect();
      }
      component.outTrigger();
      if (
        typeof component.unshift === 'function' &&
        component.unshift.length === 0
      ) {
        component.unshift();
      }
    }
  }
  unshift() {
    for (const component of this) {
      if (
        typeof component.unshift === 'function' &&
        component.unshift.length === 0
      ) {
        component.unshift();
      }
      component.shifted = false;
    }
    this.shifted = false;
  }
  shift() {
    for (const component of this) {
      if (
        typeof component.shift === 'function' &&
        component.shift.length === 0
      ) {
        component.shift();
      }
      component.shifted = true;
    }
    this.shifted = true;
  }
}
