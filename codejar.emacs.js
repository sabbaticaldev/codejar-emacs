window.onbeforeunload = (e) => {
	// Cancel the event
	e.preventDefault();

	// Chrome requires returnValue to be set
	e.returnValue = "error: CRTL+W keybinding doesn't work";
};
function moveCursorForward(editor, jar) {
	const pos = jar.save();
	if (pos.start < editor.textContent.length) {
		pos.start++;
		pos.end = pos.start;
		jar.restore(pos);
	}
}

function moveCursorBackward(editor, jar) {
	const pos = jar.save();
	if (pos.start > 0) {
		pos.start--;
		pos.end = pos.start;
		jar.restore(pos);
	}
}

function moveCursorWordForward(editor, jar) {
	const pos = jar.save();
	const text = editor.textContent;
	const nextWordPos = text.slice(pos.start).search(/\W\w/);

	if (nextWordPos !== -1) {
		pos.start += nextWordPos + 1;
		pos.end = pos.start;
		jar.restore(pos);
	}
}

function moveCursorWordBackward(editor, jar) {
	const pos = jar.save();
	const text = editor.textContent.slice(0, pos.start);
	const prevWordPos = text.search(/\w\W*$/);

	if (prevWordPos !== -1) {
		pos.start = prevWordPos;
		pos.end = pos.start;
		jar.restore(pos);
	}
}

function deleteNextWord(editor, jar) {
	const pos = jar.save();
	const text = editor.textContent;
	const nextWordPos = text.slice(pos.start).search(/\W\w/);

	if (nextWordPos !== -1) {
		const end = pos.start + nextWordPos + 1;
		editor.textContent = text.slice(0, pos.start) + text.slice(end);
		jar.updateCode(editor.textContent); // Updates the CodeJar instance
	}
}

function deletePreviousWord(editor, jar) {
	const pos = jar.save();
	const text = editor.textContent.slice(0, pos.start);
	const prevWordPos = text.search(/\w\W*$/);

	if (prevWordPos !== -1) {
		editor.textContent =
			text.slice(0, prevWordPos) + editor.textContent.slice(pos.start);
		jar.updateCode(editor.textContent); // Updates the CodeJar instance
	}
}

function transposeCharacters(editor, jar) {
	const pos = jar.save();
	if (pos.start > 0 && pos.start < editor.textContent.length) {
		const text = editor.textContent;
		const newPos = pos.start;
		const newText =
			text.slice(0, newPos - 1) +
			text[newPos] +
			text[newPos - 1] +
			text.slice(newPos + 1);

		editor.textContent = newText;
		jar.updateCode(editor.textContent); // Updates the CodeJar instance

		pos.start = newPos + 1;
		pos.end = pos.start;
		jar.restore(pos);
	}
}

function moveCursorUp(editor, jar) {
	const pos = jar.save();
	const lines = editor.textContent.split("\n");
	let currentLineStart = 0;
	let lineIndex = 0;

	// Find the start of the current line
	for (let i = 0; i < lines.length; i++) {
		const lineLength = lines[i].length + 1;
		if (currentLineStart + lineLength > pos.start) {
			lineIndex = i;
			break;
		}
		currentLineStart += lineLength;
	}

	// If not the first line, move up
	if (lineIndex > 0) {
		const prevLineLength = lines[lineIndex - 1].length;
		pos.start = pos.end =
			Math.max(currentLineStart - prevLineLength - 1, 0) +
			Math.min(pos.start - currentLineStart, prevLineLength);
		jar.restore(pos);
	}
}

function moveCursorDown(editor, jar) {
	const pos = jar.save();
	const lines = editor.textContent.split("\n");
	let currentLineStart = 0;
	let lineIndex = 0;

	// Find the start of the current line
	for (let i = 0; i < lines.length; i++) {
		const lineLength = lines[i].length + 1;
		if (currentLineStart + lineLength > pos.start) {
			lineIndex = i;
			break;
		}
		currentLineStart += lineLength;
	}

	// If not the last line, move down
	if (lineIndex < lines.length - 1) {
		const nextLineStart = currentLineStart + lines[lineIndex].length + 1;
		const nextLineLength = lines[lineIndex + 1].length;
		pos.start = pos.end =
			nextLineStart + Math.min(pos.start - currentLineStart, nextLineLength);
		jar.restore(pos);
	}
}

const emacsKeybindings = [
	{
		key: "s",
		ctrl: true,
		name: "Save",
		action: (editor) => {
			console.log("Save command executed");
			// Implement save logic here
		},
	},
	{
		key: "x",
		ctrl: true,
		name: "Close",
		action: (editor) => {
			console.log("Close command executed");
			// Implement close logic here
		},
	},
	{
		key: "f",
		ctrl: true,
		name: "Move Cursor Forward",
		action: moveCursorForward,
	},
	{
		key: "b",
		ctrl: true,
		name: "Move Cursor Backward",
		action: moveCursorBackward,
	},
	{
		key: "a",
		ctrl: true,
		name: "Move Cursor to Beginning of Line",
		action: (editor) => {
			const s = getSelection();
			const r = s.getRangeAt(0);
			r.setStart(r.startContainer, 0);
			r.setEnd(r.startContainer, 0);
			s.removeAllRanges();
			s.addRange(r);
		},
	},
	{
		key: "e",
		ctrl: true,
		name: "Move Cursor to End of Line",
		action: (editor) => {
			const s = getSelection();
			const r = s.getRangeAt(0);
			r.setStart(r.startContainer, r.startContainer.textContent.length);
			r.setEnd(r.startContainer, r.startContainer.textContent.length);
			s.removeAllRanges();
			s.addRange(r);
		},
	},
	{
		key: "d",
		ctrl: true,
		name: "Delete Next Character",
		action: (editor) => {
			const s = getSelection();
			const r = s.getRangeAt(0);
			r.setEnd(r.startContainer, r.startOffset + 1);
			r.deleteContents();
		},
	},
	{
		key: "h",
		ctrl: true,
		name: "Delete Previous Character",
		action: (editor) => {
			const s = getSelection();
			const r = s.getRangeAt(0);
			r.setStart(r.startContainer, r.startOffset - 1);
			r.deleteContents();
		},
	},
	{
		key: "k",
		ctrl: true,
		name: "Kill (Cut) to End of Line",
		action: (editor) => {
			const s = getSelection();
			const r = s.getRangeAt(0);
			r.setEnd(r.startContainer, r.startContainer.textContent.length);
			document.execCommand("cut");
		},
	},
	{
		key: "w",
		ctrl: true,
		name: "Copy",
		action: (editor) => {
			// This doesn't work
			document.execCommand("copy");
		},
	},
	{
		key: "y",
		ctrl: true,
		name: "Paste",
		action: (editor) => {
			document.execCommand("paste");
		},
	},
	{
		key: "p",
		ctrl: true,
		name: "Move Cursor Up",
		action: (editor) => {
			moveCursorUp(editor);
		},
	},
	{
		key: "n",
		ctrl: true,
		name: "Move Cursor Down",
		action: (editor) => {
			moveCursorDown(editor);
		},
	},
	{
		key: "f",
		ctrl: false,
		alt: true,
		name: "Move Cursor Forward One Word",
		action: (editor) => {
			moveCursorWordForward(editor);
		},
	},
	{
		key: "b",
		ctrl: false,
		alt: true,
		name: "Move Cursor Backward One Word",
		action: (editor) => {
			moveCursorWordBackward(editor);
		},
	},
	{
		key: "d",
		ctrl: false,
		alt: true,
		name: "Delete Next Word",
		action: (editor) => {
			deleteNextWord(editor);
		},
	},
	{
		key: "h",
		ctrl: true,
		alt: true,
		name: "Delete Previous Word",
		action: (editor) => {
			deletePreviousWord(editor);
		},
	},
	{
		key: "t",
		ctrl: true,
		name: "Transpose Characters",
		action: (editor) => {
			transposeCharacters(editor);
		},
	},
];

export default emacsKeybindings;
