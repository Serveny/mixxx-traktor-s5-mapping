import type { MixxxChannelGroup } from './types/mixxx-controls';
import type { DisplayPopup } from './components/display-area';

export type ScreenId = 'leftdeck' | 'rightdeck';

export type ScreenState = {
	group: MixxxChannelGroup;
	popup: DisplayPopup;
	sliceSize: number;
	quantizeSize: number;
};

type SharedDataEngine = {
	getSharedData?: () => Record<string, unknown> | undefined;
	setSharedData?: (data: Record<string, unknown>) => void;
};

// Feeds the screen QML (screens/TraktorKontrolS5Screens) with mapping-only state.
// shortcut: needs Mixxx's controller shared-data API (open PRs #16129/#16778), no-op until it lands.
export function publishScreenState(screenId: ScreenId, state: ScreenState) {
	const api = engine as unknown as SharedDataEngine;
	if (typeof api.setSharedData !== 'function' || typeof api.getSharedData !== 'function') {
		return;
	}
	api.setSharedData({ ...(api.getSharedData() ?? {}), [screenId]: state });
}
