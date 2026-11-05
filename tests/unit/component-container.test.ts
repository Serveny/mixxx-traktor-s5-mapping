import { describe, expect, test, vi } from 'vitest';
import { ComponentContainer } from '../../src/components/component-container';
import {
	ControlComponent,
	ControlOutMixin,
	ControlInMixin,
} from '../../src/components/component';
import { HIDReportHolder } from '../../src/hid-report';

class TestContainer extends ComponentContainer<'[Channel1]' | '[Channel3]'> {
	add(component: object, groupBound = false) {
		return this.register(component, { groupBound });
	}

	rebind(group: '[Channel1]' | '[Channel3]') {
		this.rebindGroupChildren(group);
	}
}

describe('ComponentContainer', () => {
	test('propagates shift and unshift to registered children', () => {
		const container = new TestContainer('[Channel1]');
		const childA = { shift: vi.fn(), unshift: vi.fn() };
		const childB = { shift: vi.fn(), unshift: vi.fn() };

		container.add(childA);
		container.add(childB);

		container.shift();
		container.unshift();

		expect(childA.shift).toHaveBeenCalledTimes(1);
		expect(childB.shift).toHaveBeenCalledTimes(1);
		expect(childA.unshift).toHaveBeenCalledTimes(1);
		expect(childB.unshift).toHaveBeenCalledTimes(1);
	});

	test('rebinds only group-bound children', () => {
		const container = new TestContainer('[Channel1]');
		const deckBound = { rebindGroup: vi.fn() };
		const staticChild = { rebindGroup: vi.fn() };

		container.add(deckBound, true);
		container.add(staticChild, false);

		container.rebind('[Channel3]');

		expect(container.group).toBe('[Channel3]');
		expect(deckBound.rebindGroup).toHaveBeenCalledWith('[Channel3]');
		expect(staticChild.rebindGroup).not.toHaveBeenCalled();
	});
});

class TestControl extends ControlOutMixin(
	ControlInMixin(
		ControlComponent<
			'[Channel1]' | '[Channel3]',
			{
				group: '[Channel1]' | '[Channel3]';
				inKey: 'play';
				outKey: 'play_indicator';
				reports: HIDReportHolder;
				io: {
					inReportId: 1;
					inByte: 0;
					inBit: 0;
					inLengthBit: 1;
					outReportId: 128;
					outByte: 0;
					outLengthByte: 1;
				};
			}
		>
	)
) {}

describe('control mixins', () => {
	test('rebindGroup reconnects output connections on the new group', () => {
		const reports = new HIDReportHolder();
		const control = new TestControl({
			group: '[Channel1]',
			inKey: 'play',
			outKey: 'play_indicator',
			reports,
			io: {
				inReportId: 1,
				inByte: 0,
				inBit: 0,
				inLengthBit: 1,
				outReportId: 128,
				outByte: 0,
				outLengthByte: 1,
			},
		});

		expect(globalThis.__mixxxTestState.connections).toHaveLength(1);
		expect(globalThis.__mixxxTestState.connections[0]?.group).toBe('[Channel1]');

		control.rebindGroup('[Channel3]');

		expect(globalThis.__mixxxTestState.connections).toHaveLength(1);
		expect(globalThis.__mixxxTestState.connections[0]?.group).toBe('[Channel3]');
		expect(control.group).toBe('[Channel3]');
	});
});
