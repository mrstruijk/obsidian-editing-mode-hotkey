import { Plugin, MarkdownView, WorkspaceLeaf } from 'obsidian';

type ViewMode = 'reading' | 'live-preview' | 'source';

export default class ToggleReadSourcePreview extends Plugin {
	onload() {
		this.addCommand({
			id: 'toggleReadSourcePreview',
			name: 'Toggle modes (source/live preview/reading)',
			callback: () => void this.cycleViewModes(),
		});
	}

	private getCurrentMode(view: MarkdownView): ViewMode {
		const mode = view.getMode();

		if (mode === 'preview') return 'reading';
		if (mode === 'source') {
			const state = view.getState();
			return state?.source === false ? 'live-preview' : 'source';
		}

		return 'source'; // fallback
	}

	private getNextMode(current: ViewMode): ViewMode {
		const cycle: ViewMode[] = ['reading', 'live-preview', 'source'];
		const index = cycle.indexOf(current);
		return cycle[(index + 1) % cycle.length];
	}

	private setViewMode(leaf: WorkspaceLeaf, mode: ViewMode) {
		const viewState = leaf.getViewState();

		if (viewState.type !== 'markdown') return;
		if (!viewState.state) return;

		switch (mode) {
			case 'reading':
				viewState.state.mode = 'preview';
				viewState.state.source = false;
				break;
			case 'live-preview':
				viewState.state.mode = 'source';
				viewState.state.source = false;
				break;
			case 'source':
				viewState.state.mode = 'source';
				viewState.state.source = true;
				break;
		}

		leaf.setViewState(viewState);
	}

	private async cycleViewModes() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		const currentMode = this.getCurrentMode(activeView);
		const nextMode = this.getNextMode(currentMode);

		const shouldUseLivePreview = nextMode === 'live-preview';
		await this.app.vault.setConfig('livePreview', shouldUseLivePreview);

		this.app.workspace.iterateAllLeaves(leaf => {
			this.setViewMode(leaf, nextMode);
		});
	}
}

