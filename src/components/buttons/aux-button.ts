import type { HIDReportHodler } from '../../hid-report';
import type { Btn } from '../../types/mapping';
import { Component, InMixin, SingleColorOutMixin } from '../component';

// -- 🚜 S5 Docs 4.4.2.8:
// "When the AUX button is hold, this will add both AUX channels into the mix as long the button is pressed.
// The output volumes can be set using the LOOP encoders."
export class AuxButton extends SingleColorOutMixin(InMixin(Component)) {
	isHeld = false;

	constructor(reports: HIDReportHodler, io: Btn) {
		super({ reports, io });
		this.output(0);
	}

	input(pressed: number) {
		this.isHeld = pressed !== 0;
		for (const aux of ['[Auxiliary1]', '[Auxiliary2]'] as const) {
			engine.setValue(aux, 'main_mix', this.isHeld ? 1 : 0);
		}
		this.output(this.isHeld ? 1 : 0);
	}
}
