import * as assert from 'assert';

import * as vscode from 'vscode';
import {newLineify, arrayToQuotedString, arrayToUnquotedString, splitByCommaOrNewLine} from '../src/extension';

suite("Extension Tests", () => {

    test("new lines are added", () => {
        let text = splitByCommaOrNewLine(`a,b,c,d,e,f,g`);
        let newlinified = newLineify(text)
        assert.equal(false, newlinified.includes(','));
        assert.equal(7, newlinified.split('').filter((e)=>{return e === '\n'}).length);
    });

    test("quotes are added", () => {
        let text = splitByCommaOrNewLine(`a,b,c,d,e,f,g`);
        let quotes = arrayToQuotedString(text)
        assert.equal(true, quotes.includes('"'));
        assert.equal(false, quotes.includes('\n'));
        assert.equal(14, quotes.split('').filter((e)=>{return e === '"'}).length);
    });

    test("quotes are removed", () => {
        let text = splitByCommaOrNewLine(`"a","b","c","d",'e',"f",'g'`);
        let quotes = arrayToUnquotedString(text)
        assert.equal(false, quotes.includes('"'));
        assert.equal(false, quotes.includes('"'));
        assert.equal(false, quotes.includes('\n'));
    });
});