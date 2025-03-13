import {
	Plugin,
	MarkdownView
} from 'obsidian';

export default class EditingModeHotkey extends Plugin {
	async onload() {
		console.log('loading editing-mode-hotkey');

		this.addCommand({
			id: 'toggleDefaultEditingMode',
			name: 'Toggle modes (Source/Live Preview/Reading)',
			hotkeys: [
				{
					modifiers: ['Mod', 'Shift'],
					key: 'E',
				},
			],
			callback: () => this.toggleDefaultEditingMode(),
		});
	}

	private toggleDefaultEditingMode() {
		// check the curren default view mode
		const livePreview = this.app.vault.getConfig("livePreview");
		
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		const isEditing = view?.getMode() === "source";
		const isReading = view?.getMode() === "preview";
		
		if (isReading === true) {
			this.app.vault.setConfig("livePreview", false);
				this.app.workspace.iterateAllLeaves(leaf => {
					const view = leaf.getViewState();
					if (view.state.mode === 'preview') {
						view.state.mode = 'source';
						view.state.source = true;
						leaf.setViewState(view);
					}
				});
		} else if (isEditing === true) {
			if (livePreview === false) {
				this.app.vault.setConfig("livePreview", true);
				this.app.workspace.iterateAllLeaves(leaf => {
					const view = leaf.getViewState();
					// check if the current view mode is in edit view, to prevent the state of tabs such as kanban boards to be changed
					if (view.state.mode === 'source') {
						view.state.source = false;
						leaf.setViewState(view);
					}
				});
			} else if (livePreview === true) {
				this.app.vault.setConfig("livePreview", false);
				this.app.workspace.iterateAllLeaves(leaf => {
					const view = leaf.getViewState();
					// check if the current view mode is in edit view, to prevent the state of tabs such as kanban boards to be changed
					if (view.state.mode === 'source') {
						view.state.mode = 'preview';
						view.state.source = false;
						leaf.setViewState(view);
					}
				});
			}
		}
	}
}
