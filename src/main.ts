import { mapping } from './mapping';
import { S5 } from './s5';

/* eslint no-unused-vars: "off", no-var: "off" */
var TraktorS5 = new S5(mapping);
console.info(
	' ---- Loaded Mixxx Traktor S5 Controller Mapping ---- ',
	TraktorS5
);
