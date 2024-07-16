# Emacs CodeJar keybindings

This plugin provides Emacs-style keybindings for CodeJar, a minimalist code editor. It enhances the editing experience by adding familiar Emacs shortcuts for navigation and text manipulation.

## Usage
To activate Emacs keybindings in your CodeJar editor, initialize CodeJar and apply the Emacs keybindings as shown below:

```javascript
import { CodeJar } from 'https://esm.sh/codejar';
import emacsKeybindings from 'https://esm.sh/codejar-emacs';
const highlight = (editor) => {
	//highlight function
};
const editorElement = document.querySelector('.editor');
const jar = CodeJar(editorElement, highlight, {
    keybindings: emacsKeybindings  
});

// Example usage of CodeJar with Emacs keybindings
jar.onUpdate((code) => {
    console.log('Code updated:', code);
});
```

## Keybindings Included
The Emacs plugin includes support for the following keyboard actions:
- **Navigation**: Move cursor left, right, up, down, and by word.
- **Text Manipulation**: Delete characters or words, cut to the end of the line, and transpose characters.

Each function is mapped to familiar Emacs-style shortcuts, such as `Ctrl-f` to move forward and `Ctrl-b` to move backward.

## Customization
You can extend or modify the keybindings by editing the `emacsKeybindings` array in `codejar.emacs.js`.

```javascript
const emacsKeybindings = [
    // Define or modify keybindings here
    {
        key: "s",
        ctrl: true,
        name: "Save FIle",
        action: (editor, jar) => saveFile(editor, jar)
    },
    // Additional keybindings...
];
```


## Known Issues

- This project is a POC, still early in development
- The browser don't let us use a few of the key combinations, like crtl+w or crtl+n. 