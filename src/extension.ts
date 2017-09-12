'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let quote = vscode.commands.registerCommand('extension.quotifyQuoteStrings', () => quoteStrings());

    let unquote = vscode.commands.registerCommand('extension.quotifyUnquoteStrings', () => unquoteStrings());

    let newline = vscode.commands.registerCommand('extension.quotifyNewlineStrings', () => newLineStrings());

    context.subscriptions.push(quote);
    context.subscriptions.push(unquote);
    context.subscriptions.push(newline);
}

export function deactivate() {
}

function quoteStrings () {
    let editor = vscode.window.activeTextEditor;
    let range;
    if (!editor.selection.isEmpty) {
        range = editor.selection;
    } else {
        vscode.window.showErrorMessage("No text selected");
        return;
    }

    let text = editor.document.getText(range);
    let result = arrayToQuotedString(splitByCommaOrNewLine(text));
    editor.edit((builder) =>{
        builder.replace(range,result);
    });
    editor.revealRange(range);
}

function unquoteStrings () {
    let editor = vscode.window.activeTextEditor;
    let range;
    if (!editor.selection.isEmpty) {
        range = editor.selection;
    } else {
        vscode.window.showErrorMessage("No text selected");
        return;
    }

    let text = editor.document.getText(range);
    let result = arrayToUnquotedString(splitByCommaOrNewLine(text));
    editor.edit((builder) =>{
        builder.replace(range,result);
    });
    editor.revealRange(range);
}

function newLineStrings () {
    let editor = vscode.window.activeTextEditor;
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

export function splitByCommaOrNewLine (text: string): Array<string> {
    if(text.includes(',')){
        return text.split(",")
    }else {
        return text.split('\n');
    }
}

export function arrayToQuotedString (strings: Array<string>) : string {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((str,idx, arr)=>{
       let last = arr.length - 1;
       return idx === last ? `"${str.trim()}"` : `"${str.trim()}",`;
    }).reverse()
    .reduce((curr,prev) : string => {
        return prev += `${curr}`;
    },"");
}

export function arrayToUnquotedString (strings: Array<string>) : string {
    return strings.filter((el)=>{
        return el.trim() !== ""
    })
    .map((str,idx, arr)=>{
       let last = arr.length - 1;
       let replace = `${str.trim().replace(/^"(.*)"$/, '$1')}`; 
       return idx === last ? replace : replace + ',';
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