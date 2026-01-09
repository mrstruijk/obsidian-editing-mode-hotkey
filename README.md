# Cycling Modes Hotkey
A simple plugin which adds a command and a hotkey to toggle between "Source" and "Live Preview" and "Reading".
This command cycles through the modes each time you press it. These changes will affect all open editors.

## Usage
### Via command palette
Search for 'Toggle Modes (Source/Live Preview/Reading)'

### Via hotkey
You can set a hotkey in the 'Hotkeys' section of Obsidian. 

### Via GUI button

You can add a GUI button for with [Commander](https://github.com/phibr0/obsidian-commander).
For example in the Tab bar:
- Obsidian Settings - Community Plugins - Commander - Tab Bar - Add command - Search for "Toggle Modes (Source/Live Preview/Reading)" - Choose an icon - Save

Additionally, you can remove the default Live-Preview / Read button in the tab bar with this CSS snippet. 
``` css
/*
hide-read-livepreview-button.css

Provided by Anwan https://forum.obsidian.md/t/how-can-i-hide-the-read-edit-switch-button-on-the-title-bar/75925
*/
 
.clickable-icon.view-action[aria-label^="Current view"] {
    display: none !important;
}
```

Store this in `/PATH/TO/YOUR_OBSIDIAN_VAULT/.obsidian/snippets/hide-read-livepreview-button.css`.
Enable it in Obsidian Settings - Appearance - CSS snippets - hide-read-livepreview-button


## Contributions

Based on [Signynt's Editing Mode Hotkey](https://github.com/Signynt/obsidian-editing-mode-hotkey).

Please feel free to make or suggest any changes and improvements. 
