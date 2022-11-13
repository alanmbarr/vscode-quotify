import * as assert from 'assert';

import * as ext from '../../extension';

suite("Extension Tests", () => {

    test("new lines are added", () => {
        let text = ext.splitByCommaOrNewLine(`a,b,c,d,e,f,g`);
        let newlinified = ext.newLineify(text)
        assert.equal(newlinified.includes(','), false);
        assert.equal(newlinified.split('').filter((e)=>{return e === '\n'}).length, 7);
    });

    test("commas and new lines are added", () => {
        let text = ext.splitByCommaOrNewLine(`a,b,c,d,e,f,g`);
        let commanewlinified = ext.commaNewLineify(text)
        assert.equal(commanewlinified.includes(','), true);
        assert.equal(commanewlinified.split('').filter((e)=>{return e === '\n' || e === ',' }).length, 13);
    });

    test("quotes are added", () => {
        let text = ext.splitByCommaOrNewLine(`a,b,c,d,e,f,g`);
        let quotes = ext.arrayToQuotedString(text, '\"')
        assert.equal(quotes.includes('"'), true);
        assert.equal(quotes.includes('\n'), false);
        assert.equal(quotes.split('').filter((e)=>{return e === '"'}).length, 14);
    });

    test("quotes are removed", () => {
        let text = ext.splitByCommaOrNewLine(`"a","b","c","d",'e',"f",'g'`);
        let quotes = ext.arrayToUnquotedString(text, '\"')
        assert.equal(quotes.includes('"'), false);
        assert.equal(quotes.includes('"'), false);
        assert.equal(quotes.includes('\n'), false);
    });

    test("quotes are removed", () => {
        let text = ext.splitByCommaOrNewLine(`'a','b','c','d','e','f','g'`);
        let quotes = ext.arrayToUnquotedString(text, '\"')
        assert.equal(quotes.includes('"'), false);
        assert.equal(quotes.includes('\n'), false);
    });

    // Need more robust series of tests for escaping single quotes
    // test("Array to SQL set", () => {
    //     let text = ext.splitByCommaOrNewLine(`"a","b","c","d",'e',"f",'g'`);
    //     let quotes = ext.arrayToSqlSetString(text);
    //     assert.equal(quotes, '(a,b,c,d,e,f,g)', "Should appear as such");
    //     assert.equal(quotes.includes('"'), false, "Not supposed to have double quotes");
    //     assert.equal(quotes.includes('\n'), false, "Not supposed to have new lines");
    //     assert.equal(quotes.startsWith('('), true);
    //     assert.equal(quotes.endsWith(')'), true);
    // });


});