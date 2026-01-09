import { Plugin, MarkdownView, WorkspaceLeaf } from 'obsidian';

type ViewMode = 'reading' | 'live-preview' | 'source';

export default class ToggleReadSourcePreview extends Plugin {
	async onload() {
		console.log('loading obsidian-toggle-read-source-preview');
		
		this.addCommand({
			id: 'toggleReadSourcePreview',
			name: 'Toggle modes (Source/Live Preview/Reading)',
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'E' }],
			callback: () => this.cycleViewModes(),
		});
	}

	private getCurrentMode(view: MarkdownView): ViewMode {
		const mode = view.getMode();
		
		if (mode === 'preview') return 'reading';
		if (mode === 'source') {
			// Check if it's Live Preview or Source mode
			const state = view.getState();
			return state.source === false ? 'live-preview' : 'source';
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
		
		// Only change markdown views
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

	private cycleViewModes() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) return;

		const currentMode = this.getCurrentMode(activeView);
		const nextMode = this.getNextMode(currentMode);

		// Update the global config for new views
		const shouldUseLivePreview = nextMode === 'live-preview';
		this.app.vault.setConfig('livePreview', shouldUseLivePreview);

		// Apply to all markdown leaves
		this.app.workspace.iterateAllLeaves(leaf => {
			this.setViewMode(leaf, nextMode);
		});
	}
}
