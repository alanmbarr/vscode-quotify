'use strict';
import * as vscode from 'vscode';
import { inputQuotes } from './inputQuotes';

export function activate(context: vscode.ExtensionContext) {

    let quote = vscode.commands.registerCommand('extension.quotifyQuoteStrings', () => quoteStrings());
    let unquote = vscode.commands.registerCommand('extension.quotifyUnquoteStrings', () => unquoteStrings());
    let newline = vscode.commands.registerCommand('extension.quotifyNewlineStrings', () => newLineStrings());
    let commaNewLine = vscode.commands.registerCommand('extension.quotifyCommaNewlineStrings', () => commaNewLineStrings());
    // let arrayString = vscode.commands.registerCommand('extension.buildArrayString', () => buildArrayString());
    // let sqlSetString = vscode.commands.registerCommand('extension.buildSqlSetString', () => buildSqlSetString());

    context.subscriptions.push(quote);
    context.subscriptions.push(unquote);
    context.subscriptions.push(newline);
    context.subscriptions.push(commaNewLine);
    // context.subscriptions.push(arrayString);
    // context.subscriptions.push(sqlSetString);
}

export function deactivate() {
}

// function buildArrayString() {
//     let editor = vscode.window.activeTextEditor;
//     let range;
//     if (!editor.selection.isEmpty) {
//         range = editor.selection;
//     } else {
//         vscode.window.showErrorMessage("No text selected");
//         return;
//     }

//     let text = editor.document.getText(range);
//     let result = JSON.stringify(splitByCommaOrNewLine(text));
//     editor.edit((builder) => {
//         builder.replace(range, result);
//     });
//     editor.revealRange(range);
// }

// function buildSqlSetString() {
//     let editor = vscode.window.activeTextEditor;
//     let range;
//     if (!editor.selection.isEmpty) {
//         range = editor.selection;
//     } else {
//         vscode.window.showErrorMessage("No text selected");
//         return;
//     }

//     let text = editor.document.getText(range);
//     let result = arrayToSqlSetString(splitByCommaOrNewLine(text));
//     editor.edit((builder) => {
//         builder.replace(range, result);
//     });
//     editor.revealRange(range);
// }

async function quoteStrings () {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        vscode.window.showErrorMessage("No text editor open");
        return;
    }

    let range;
    if (!editor.selection.isEmpty) {
        range = editor.selection;
    } else {
        vscode.window.showErrorMessage("No text selected");
        return;
    }

    // Get User's choice of quote
    var input = await inputQuotes();

    let text = editor.document.getText(range);
    let result = arrayToQuotedString(splitByCommaOrNewLine(text), input);
    editor.edit((builder) =>{
        builder.replace(range,result);
    });
    editor.revealRange(range);
}

async function unquoteStrings () {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        vscode.window.showErrorMessage("No text editor open");
        return;
    }

    let range;
    if (!editor.selection.isEmpty) {
        range = editor.selection;
    } else {
        vscode.window.showErrorMessage("No text selected");
        return;
    }

    // Get User's choice of quote
    var input = await inputQuotes();

    let text = editor.document.getText(range);
    let result = arrayToUnquotedString(splitByCommaOrNewLine(text), input);
    editor.edit((builder) =>{
        builder.replace(range,result);
    });
    editor.revealRange(range);
}

function commaNewLineStrings () {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        vscode.window.showErrorMessage("No text editor open");
        return;
    }

    let range;
    if (!editor.selection.isEmpty) {
        range = editor.selection;
    } else {
        vscode.window.showErrorMessage("No text selected");
        return;
    }

    let text = editor.document.getText(range);
    let result = commaNewLineify(splitByCommaOrNewLine(text));
    editor.edit((builder) =>{
        builder.replace(range,result);
    });
    editor.revealRange(range);
}

function newLineStrings () {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        vscode.window.showErrorMessage("No text editor open");
        return;
    }

    let range;
    if (!editor.selection.isEmpty) {
        range = editor.selection;
    } else {
        vscode.window.showErrorMessage("No text selected");
        return;
    }

    let text = editor.document.getText(range);
    let result = newLineify(splitByCommaOrNewLine(text));
    editor.edit((builder) =>{
        builder.replace(range,result);
    });
    editor.revealRange(range);
}

/**
 * Split by commas (with leading/trailing spaces or tabs)
 * or by newlines (with optional carriage return)
 * 
 * @param text the string to split
 */
export function splitByCommaOrNewLine (text: string): Array<string> {
    if(text.includes(',')){
        return text.split(/[ \t]*,[ \t]*/)
    }else {
        return text.split(/\r?\n/);
    }
}

/**
 * Ghetto escape and single quote array of strings
 * @param strings array of strings to convert
 */
// export function arrayToSqlSetString(strings: Array<string>): string {
//     var strings = arrayToUnquotedString(strings).split(",");
//     var result = strings.filter((el) => {
//         return el.trim() !== ""
//     })
//     .map((str, idx, arr) => {
//         let last = arr.length - 1;
//         return idx === last ? `'${str.trim().replace('\'', '\'\'')}'` : `'${str.trim().replace('\'', '\'\'')}',`;
//     }).reverse()
//     .reduce((curr, prev): string => {
//         return prev += `${curr}`;
//     }, "");

//     return '(' + result + ')';
// }

export function arrayToQuotedString (strings: Array<string>, quoteChar: string) : string {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((str,idx, arr)=>{
       let last = arr.length - 1;
       return idx === last ? `${quoteChar}${str.trim()}${quoteChar}` : `${quoteChar}${str.trim()}${quoteChar},`;
    }).reverse()
    .reduce((curr,prev) : string => {
        return prev += `${curr}`;
    },"");
}

export function arrayToUnquotedString (strings: Array<string>, quoteChar: string) : string {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((str,idx, arr)=>{
       let last = arr.length - 1;
       let pattern = quoteChar === '\'' ? /^'(.*)'$/ : /^"(.*)"$/;
       let replace = `${str.trim().replace(pattern, '$1')}`; 
       return idx === last ? replace : replace + ',';
    }).reverse()
    .reduce((curr,prev) : string => {
        return prev += `${curr}`;
    },"");
}

export function commaNewLineify (strings: Array<string>) : string {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((str,idx, arr)=>{
       let last = arr.length - 1;
       let replace = `${str.trim().replace(/^"(.*)"$/, '$1')}`; 
       return idx === last ? replace+'\n' : replace + ',\n';
    }).reverse()
    .reduce((curr,prev) : string => {
        return prev += `${curr}`;
    },"");
}

export function newLineify (strings: Array<string>) : string {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((el) => {return `${el}\n`})
    .reverse()
    .reduce((curr,prev) : string => {
        return prev += `${curr}`;
    },"");
}