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

