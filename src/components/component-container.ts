import type { ComponentChild, ControlOptions } from '../types/component';
import { ShiftMixin, ControlComponent } from './component';

interface RegisteredChild {
	component: ComponentChild;
	groupBound: boolean;
}

export abstract class ComponentContainer<
	TGroup extends MixxxControls.Group,
> extends ShiftMixin(
	ControlComponent<MixxxControls.Group, ControlOptions<MixxxControls.Group>>
) {
	declare group: TGroup;
	private children: RegisteredChild[] = [];

	constructor(group: TGroup) {
		super({ group });
	}

	protected register<T extends ComponentChild>(
		component: T,
		options: { groupBound?: boolean } = {}
	): T {
		this.children.push({
			component,
			groupBound: options.groupBound ?? false,
		});
		return component;
	}

	protected registerAll<T extends ComponentChild>(
		components: Iterable<T>,
		options: { groupBound?: boolean } = {}
	): void {
		for (const component of components) {
			this.register(component, options);
		}
	}

	*[Symbol.iterator]() {
		for (const { component } of this.children) {
			yield component;
		}
	}

	protected rebindGroupChildren(group: TGroup) {
		this.group = group;
		for (const { component, groupBound } of this.children) {
			if (!groupBound) {
				continue;
			}
			const rebindGroup = (component as Record<string, unknown>).rebindGroup;
			if (typeof rebindGroup === 'function') {
				(rebindGroup as (group: TGroup) => void).call(component, group);
			}
		}
	}

	reconnectComponents(callback?: (component: ComponentChild) => boolean) {
		for (const component of this) {
			if (callback && !callback.call(this, component)) continue;
			const componentRecord = component as Record<string, unknown>;
			const outDisconnect = componentRecord.outDisconnect;
			const outConnect = componentRecord.outConnect;
			const outTrigger = componentRecord.outTrigger;

			if (typeof outDisconnect === 'function') outDisconnect.call(component);
			if (typeof outConnect === 'function') outConnect.call(component);
			if (typeof outTrigger === 'function') outTrigger.call(component);
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
			const fn = (component as Record<string, unknown>)[fnName];
			if (typeof fn === 'function') {
				(fn as () => void).call(component);
			}
		}
	}
}

// Factory to keep TGroup (can't give TGroup into GroupComponent)
export function createCompContainer<TGroup extends MixxxControls.Group>() {
	return ComponentContainer<TGroup>;
}
