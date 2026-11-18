import type { MixxxChannelGroup } from './types/mixxx-controls';
import type { DisplayPopup } from './components/display-area';

export type ScreenId = 'leftdeck' | 'rightdeck';

export type ScreenState = {
	group: MixxxChannelGroup;
	popup: DisplayPopup;
	sliceSize: number;
	quantizeSize: number;
	// Display browser (manual 2.1). The *Request values are counters: the screen acts once per increment.
	browserScrollRequest: number;
	browserActivateRequest: number;
	browserBackRequest: number;
	browserPreviewRequest: number;
	browserSorting: boolean;
	browserSortColumn: number;
	browserSortDescending: boolean;
	browserPreviewMode: boolean;
};

type SharedValueEngine = {
	setSharedValue?: (entity: string, key: string, value: string | number | boolean) => void;
};

const api = () => engine as unknown as SharedValueEngine;

// shortcut: needs Mixxx's controller shared-data API (open PR mixxxdj/mixxx#16129, applied locally),
// and `sharedDataNamespace="S5"` on the <controller> of the HID and the bulk mapping XML.
export function hasScreenApi() {
	return typeof api().setSharedValue === 'function';
}

// Feeds the screen QML (screens/TraktorKontrolS5Screens) with mapping-only state.
export function publishScreenState(screenId: ScreenId, state: ScreenState) {
	if (!hasScreenApi()) return;
	for (const key of Object.keys(state) as (keyof ScreenState)[]) {
		api().setSharedValue!(screenId, key, state[key]);
	}
}
