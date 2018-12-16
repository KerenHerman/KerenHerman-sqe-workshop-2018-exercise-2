import assert from 'assert';
import {parseCode, deleteTable, parseText} from '../src/js/code-analyzer';



/*it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });*/

describe('The javascript parser', () => {
    //no arguments
    emptyFunc();
    testLiteral();
    testIdentifier();
    testMemberExpression();
    testBinaryExpression();
    testUnaryExpression();
    testLogicalExpression();
    testUpdateExpression();
    testUpdateExpressionPrefix();
    testVariableDeclaration();
    testVariableDeclarationWithValue();
    testVariableDeclarationWithNegValue();
    testAssignmentExpression();

    //agruments
    notEmptyFunc();
    notEmptyFuncWithVal();
    testWhileStatement();
    testBigWhileStatement();
    funcIfTrue();
    funcIfFalse();
    funcWhileFalse();
    testIfStatement();
    testIfElseStatement();
    testIfElseStatement1()
    testIfElseElseStatement();
    testForStatement();
   /* testForWithoutInit();
    testForWithoutUpdate()*/
 /*   testFunctionDeclaration();
    testFunctionDeclarationWithParams();

    testDefaultBreak();*/
});

function valsToMapTest(valforColors) {
    let ans = [];
    if ((valforColors === undefined) || (valforColors == null) || (valforColors == "undefined")) {
    }
    else{
        let valsAsArray = (valforColors.substring(1, valforColors.length - 1)).split('|');
        for (let i = 0; i < valsAsArray.length; i++) {
            let pair = valsAsArray[i].split('=');
            //this is array
            if (pair[1].includes('[')) {
                let array = (pair[1].substring(1, pair[1].length - 1)).split(',');
                for (let j = 0; j < array.length; j++) {
                    ans.push({'var': '' + pair[0] + '[' + j + ']', 'val': array[j]});
                }
            }
            else
                ans.push({'var': pair[0], 'val': pair[1]});
        }
    }
    return ans;
}

function emptyFunc() {
    it('is parsing an empty function', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testLiteral() {
    it('is parsing an literal expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + '1;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testIdentifier() {
    it('is parsing an identifier expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'x;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testMemberExpression() {
    it('is parsing an member expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'x[1];\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testBinaryExpression() {
    it('is parsing an binary expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + '1>1;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testUnaryExpression() {
    it('is parsing an unary expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + '!x;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testLogicalExpression() {
    it('is parsing an logical expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'a && b;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testUpdateExpression() {
    it('is parsing an update expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'x++;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testUpdateExpressionPrefix() {
    it('is parsing an update expression with prefix', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + '++x;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testVariableDeclaration(){
    it('is parsing an variable declaration', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'let x;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}
function testVariableDeclarationWithValue(){
    it('is parsing an variable declaration with value', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'let x = 1;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testVariableDeclarationWithNegValue(){
    it('is parsing an variable declaration with value', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'let x = -1;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}

function testAssignmentExpression() {
    it('is parsing an assignment expression', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'x=0;\n' + '}', '()')),
            '\"function foo(){\\n}\"'
        );
        deleteTable();
    });
}


function notEmptyFunc() {
    it('is parsing an non empty function', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x){\n' + '}', '()')),
            '\"function foo(x){\\n}\"'
        );
        deleteTable();
    });
}

function notEmptyFuncWithVal() {
    it('is parsing an non empty function with val', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x){\n' + '}', '[{var:x, val:1})')),
            '\"function foo(x){\\n}\"'
        );
        deleteTable();
    });
}




function testWhileStatement() {
    let val = valsToMapTest('(x=2)');
    it('is parsing an while statement', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x){\n' + 'while(x>1){\n' + 'x=x+1;\n' + '}\n' + '}\n', val)),
            '\"function foo(x){\\n<mark style=\\\"background-color: green\\\">while((x > 1)){</mark>\\nx = (x + 1);\\n}\\n}\"'
        );
        deleteTable();
    });
}

function testBigWhileStatement() {
    let val = valsToMapTest('(x=1|y=2|z=3)');
    it('is parsing an big while statement', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    while (a < z) {\n' +
                '        c = a + b;\n' +
                '        z = c * 2;\n' +
                '    }\n' +
                '    \n' +
                '    return z;\n' +
                '}', val)),
            "\"function foo(x, y, z){\\n<mark style=\\\"background-color: green\\\">while(((x + 1) < z)){</mark>\\nz = (((x + 1) + ((x + 1) + y)) * 2);\\n}\\nreturn z;\\n}\"");
        deleteTable();
    });
}



function funcIfTrue() {
    it('is parsing an empty function true', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'if(true){\n' + '}\n' + '}', '()')),
            '\"function foo(){\\n<mark style=\\\"background-color: green\\\">if (true){</mark>\\n}\\n}\"'
        );
        deleteTable();
    });
}

function funcIfFalse() {
    it('is parsing an empty function false', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'if(false){\n' + '}\n' + '}', '()')),
            '\"function foo(){\\n<mark style=\\\"background-color: red\\\">if (false){</mark>\\n}\\n}\"'
        );
        deleteTable();
    });
}

function funcWhileFalse() {
    it('is parsing an empty function false', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(){\n' + 'while(false){\n' + '}\n' + '}', '()')),
            '\"function foo(){\\n<mark style=\\\"background-color: red\\\">while(false){</mark>\\n}\\n}\"'
        );
        deleteTable();
    });
}
function testIfStatement(){
    let val = valsToMapTest('(x=2)');
    it('is parsing an if statement', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x){\n' + 'if(x<1){\n' + 'x=x+1;\n' + '}\n' + '}\n', val)),
            '\"function foo(x){\\n<mark style=\\\"background-color: red\\\">if ((x < 1)){</mark>\\nx = (x + 1);\\n}\\n}\"'
        );
        deleteTable();
    });
}

function testIfElseStatement() {
    let val = valsToMapTest('(x=1|y=2|z=3)');
    it('is parsing an if else statement', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } \n' +
                '}\n', val)),
            "\"function foo(x, y, z){\\n<mark style=\\\"background-color: red\\\">if ((((x + 1) + y) < z)){</mark>\\nreturn (((x + y) + z) + (0 + 5));\\n}\\n<mark style=\\\"background-color: green\\\">else if ((((x + 1) + y) < (z * 2))){</mark>\\nreturn (((x + y) + z) + ((0 + x) + 5));\\n}\\n}\""
        );
        deleteTable();
    });
}


function testIfElseStatement1() {
    let val = valsToMapTest('(x=1|y=2|z=3)');
    it('is parsing an if else statement', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else if (b > z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } \n' +
                '}\n', val)),
            "\"function foo(x, y, z){\\n<mark style=\\\"background-color: red\\\">if ((((x + 1) + y) < z)){</mark>\\nreturn (((x + y) + z) + (0 + 5));\\n}\\n<mark style=\\\"background-color: red\\\">else if ((((x + 1) + y) > (z * 2))){</mark>\\nreturn (((x + y) + z) + ((0 + x) + 5));\\n}\\n}\""
        );
        deleteTable();
    });
}

function testIfElseElseStatement() {
    let val = valsToMapTest('(x=1|y=2|z=3)');
    it('is parsing an if else statement', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '        return x + y + z + c;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '        return x + y + z + c;\n' +
                '    }\n' +
                '}\n', val)),
            "\"function foo(x, y, z){\\n<mark style=\\\"background-color: red\\\">if ((((x + 1) + y) < z)){</mark>\\nreturn (((x + y) + z) + (0 + 5));\\n}\\n<mark style=\\\"background-color: green\\\">else if ((((x + 1) + y) < (z * 2))){</mark>\\nreturn (((x + y) + z) + ((0 + x) + 5));\\n}\\nelse {\\nreturn (((x + y) + z) + ((0 + z) + 5));\\n}\\n}\""
        );
        deleteTable();
    });
}

function testForStatement(){
    let val = valsToMapTest('(x=1)');
    it('is parsing an for statement', () => {
        assert.equal(
            JSON.stringify(parseText('function foo(x){\n' +
                'for(x=0; x<3; x++){}\n' +
                '}', val)),
            "\"function foo(x){\\n}\"");
        deleteTable();
    });
}

function testForWithoutInit() {
    it('is parsing an for statement', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(){\n' +
                '    for(; i<2; i++){}\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":2,"type":"for statement","name":"","condition":"i < 2","value":""},' +
            '{"line":2,"type":"assignment expression","name":"i","condition":"","value":"i++"}]'
        );
        deleteTable();
    });
}

function testForWithoutUpdate() {
    it('is parsing an for statement', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(){\n' +
                '    for(; i<2;){}\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":2,"type":"for statement","name":"","condition":"i < 2","value":""}]'
        );
        deleteTable();
    });
}

function testFunctionDeclaration() {
    it('is parsing an function declaration', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(){\n' +
                '    return -1;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":2,"type":"return statement","name":"","condition":"","value":"-1"}]'
        );
        deleteTable();
    });
}

function testFunctionDeclarationWithParams() {
    it('is parsing an function declaration', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(x){\n' +
                '    return -1;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"test","condition":"","value":""},' +
            '{"line":1,"type":"variable declaration","name":"x","condition":"","value":""},'+
            '{"line":2,"type":"return statement","name":"","condition":"","value":"-1"}]'
        );
        deleteTable();
    });
}

function testDefaultBreak() {
    it('is parsing an function declaration', () => {
        assert.equal(
            JSON.stringify(parseCode(';')),
            '[]'
        );
        deleteTable();
    });
}