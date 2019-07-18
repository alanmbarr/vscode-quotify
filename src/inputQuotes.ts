import { window } from 'vscode';

/**
 * Prompts user for inputting quotes using window.showInputBox().
 */
export async function inputQuotes() {
	const result = await window.showInputBox({
		value: '\"',
		placeHolder: 'Enter single (\') or double (\") quotes',
		validateInput: text => text !== '\'' && text !== '\"' ? 'Only single or double quote character is allowed' : null
	});
	return result;
}
