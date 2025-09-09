import { Component } from './component';
export class ComponentContainer extends Component {
  constructor() {
    super({});
  }
  *[Symbol.iterator]() {
    // can't use for...of here because it would create an infinite loop
    for (const property in this) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        const obj = this[property];
        if (obj instanceof Component) {
          yield obj;
        } else if (Array.isArray(obj)) {
          for (const objectInArray of obj) {
            if (objectInArray instanceof Component) {
              yield objectInArray;
            }
          }
        }
      }
    }
  }
  reconnectComponents(callback: (component: Component) => void) {
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
