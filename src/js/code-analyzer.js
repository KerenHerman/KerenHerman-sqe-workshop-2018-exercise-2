import * as esprima from 'esprima';


let parsedtext = '';
const parseText = (codeToParse, valforColors) => {
    parseCode(codeToParse, valforColors);
    return parsedtext;
};
export {parseText};

//[{var:x, val:1}, {var:y, val:2}, ...]
let inputVal = [];
//add location to the tokens.
const parseCode = (codeToParse, valforColors) => {
    inputVal = valforColors;
    createTable(esprima.parseScript(codeToParse,  { loc: true }));
};
export {parseCode};

//each row is: <line, type, name, condition, value>
let tableRows = [];

const createTable = (parsedCode) => {
    analyzeJson(parsedCode, []);
};
export {createTable};

let funcParams = [];

const deleteTable = () => {
    tableRows = [];
    parsedtext = '';
    funcParams = [];
    inputVal = [];
};
export {deleteTable};

function analyzeJson(parsedCode, env){
    switch (parsedCode.type) {
    case 'Program':analyzeJson(parsedCode.body[0], env);break;
    case 'FunctionDeclaration':functionDeclarationCase(parsedCode, env);analyzeJson(parsedCode.body, env);parsedtext = parsedtext+'}';break;
    case 'BlockStatement':parsedCode.body.forEach(function (x) {analyzeJson(x, env);});break;
    case 'VariableDeclaration':parsedCode.declarations.forEach(function (x) {analyzeJson(x, env);});break;
    default: analyzeJsonCon(parsedCode, env); break;
    }
}

function analyzeJsonCon(parsedCode, env) {
    switch (parsedCode.type) {
    case 'VariableDeclarator':variableDeclaratorCase(parsedCode, env);break;
    case 'AssignmentExpression':expressionStatementCase(parsedCode, env); break;
    case 'ExpressionStatement':analyzeJson(parsedCode.expression, env);break;
    case 'WhileStatement':analyzeWhileStatement(parsedCode, env);break;
    default: analyzeJsonCon1(parsedCode, env); break;
    }
}
function analyzeWhileStatement(parsedCode, env){
    whileStatementCase(parsedCode, env);
    let newEnv = [];
    for(let i =0; i<env.length; i++){
        newEnv.push(env[i]);
    }
    analyzeJson(parsedCode.body, newEnv);
    parsedtext = parsedtext + '}\n';
}

function analyzeJsonCon1(parsedCode, env) {
    switch (parsedCode.type) {
    case 'IfStatement':ifStatementCase(parsedCode, env);break;
    case 'ReturnStatement':returnStatementCase(parsedCode, env);break;
    case 'ForStatement': forStatementCase(parsedCode, env);analyzeJson(parsedCode.body, env); break;
    default: analyzeExpInsert(parsedCode, env);
    }
}

function analyzeExpInsert(parsedCode, env){
    switch (parsedCode.type) {
    case 'Literal':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', '', analyzeExp(parsedCode, env), env);break;
    case 'Identifier':createLineInTable(parsedCode.loc.start.line, parsedCode.type, analyzeExp(parsedCode, env), '', '', env);break;
    case 'MemberExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', '', analyzeExp(parsedCode, env), env);break;
    case 'BinaryExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', analyzeExp(parsedCode, env), '', env); break;
    default:analyzeExpInsertCon(parsedCode, env); break;
    }
}

function analyzeExpInsertCon(parsedCode, env) {
    switch (parsedCode.type) {
    case 'UnaryExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, analyzeExp(parsedCode.argument, env), '',  analyzeExp(parsedCode, env), env);break;
    case 'LogicalExpression':createLineInTable(parsedCode.loc.start.line, parsedCode.type, '', '', analyzeExp(parsedCode, env), env); break;
    //case 'UpdateExpression':createLineInTable(parsedCode.loc.start.line, 'assignment expression', analyzeExp(parsedCode.argument, env), '',  analyzeExp(parsedCode, env), env); break;
    //update
    default: createLineInTable(parsedCode.loc.start.line, 'assignment expression', analyzeExp(parsedCode.argument, env), '',  analyzeExp(parsedCode, env), env); break;
    }
}

function createLineInTable(line, type, name, condition, value, env) {
    let newEnv = [];
    for (let i = 0; i < env.length; i++) {
        newEnv.push(env[i]);
    }
    tableRows.push({'line': line, 'type': type, 'name': name, 'condition': condition, 'value': value, 'env': newEnv});
}

function addToEnv(env, variable, value){
    env.push({'var': variable, 'val': value});
}

function functionDeclarationCase(parsedCode, env) {
    let funcName =  parsedCode.id.name;
    createLineInTable(parsedCode.id.loc.start.line, 'function declaration', funcName, '', '', env);
    parsedCode.params.forEach(function (x) {
        funcParams.push(x.name);
        createLineInTable(x.loc.start.line, 'variable declaration', x.name, '', '', env);
    });
    parsedtext = parsedtext + 'function '+ funcName +'(';
    if(funcParams.length == 0)
        parsedtext = parsedtext + '){\n';
    for(let i=0; i<funcParams.length; i++){
        if(i == funcParams.length-1)
            parsedtext = parsedtext + funcParams[i] + '){\n';
        else
            parsedtext = parsedtext + funcParams[i] + ', ';}
}


function variableDeclaratorCase(parsedCode, env) {
    if(parsedCode.init == null)
        createLineInTable(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', parsedCode.init, env);
    else {
        if( parsedCode.init.type === 'UnaryExpression' ||  parsedCode.init.type === 'MemberExpression') {
            let val = '' + parsedCode.init.operator + analyzeExp(parsedCode.init.argument, env);
            createLineInTable(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', val, env);
            addToEnv(env,parsedCode.id.name, val);
        }
        else {
            let val = analyzeExp(parsedCode.init, env);
            createLineInTable(parsedCode.loc.start.line, 'variable declaration', parsedCode.id.name, '', val, env);
            addToEnv(env,parsedCode.id.name, val);
        }
    }
}

function expressionStatementCase(parsedCode, env) {
    let vari = analyzeExp(parsedCode.left, env);
    let vali = analyzeExp(parsedCode.right, env);
    createLineInTable(parsedCode.loc.start.line, 'assignment expression',vari, '', vali, env);
    for(let i=0; i<funcParams.length; i++){
        if(vari === funcParams[i]){
            parsedtext = parsedtext +vari+ ' = ' + getValFromEnv(vali, env) + ';\n';
            break;
        }
    }
    addToEnv(env, vari, getValFromEnv(vali, env));
}


function whileStatementCase(parsedCode, env){
    let test = analyzeExp(parsedCode.test, env);
    createLineInTable(parsedCode.loc.start.line,'while statement', '', test, '', env);
    //substitute
    let testAfterSub = getValFromEnv(test, env);
    //add to text
    let preText = '';
    //mark in green
    if(checkIfTrue(testAfterSub))
        preText = '<mark style="background-color: green">';
    else  preText = '<mark style="background-color: red">';
    parsedtext = parsedtext + preText + 'while(' + testAfterSub + '){</mark>\n';
}

//for example: testAfterSub = x + y < z
function checkIfTrue(testAfterSub) {
    for(let i=0; i<inputVal.length; i++){
        if (testAfterSub.includes(inputVal[i]['var']))
            testAfterSub = testAfterSub.replace(inputVal[i]['var'], inputVal[i]['val']);
    }
    return eval(testAfterSub);
}

function ifStatementCase(parsedCode, env) {
    let test = ''+analyzeExp(parsedCode.test, env);
    createLineInTable(parsedCode.loc.start.line,'if statement', '', test ,'', env);
    let newEnv = [];
    for(let i =0; i<env.length; i++){
        newEnv.push(env[i]);
    }
    //substitute
    let testAfterSub = getValFromEnv(test, env);
    //add to text
    let preText = '';
    if(checkIfTrue(testAfterSub))
        preText = '<mark style="background-color: green">';
    else  preText = '<mark style="background-color: red">';
    parsedtext = parsedtext + preText + 'if (' + testAfterSub + '){</mark>\n';
    analyzeJson(parsedCode.consequent, newEnv);
    parsedtext = parsedtext + '}\n';
    checkElsefStat(parsedCode, env);
}

function checkElsefStat(parsedCode, env) {
    //there is if else or else statement.
    if(parsedCode.alternate != null){
        //else if.
        elseif(parsedCode, env);
    }
}

function elseif(parsedCode, env){
    let newEnv = [];
    for(let i =0; i<env.length; i++){
        newEnv.push(env[i]);
    }
    let test = ''+analyzeExp(parsedCode.alternate.test, env);
    createLineInTable(parsedCode.alternate.loc.start.line, 'else if statement', '', test, '', env);
    //substitute
    let testAfterSub = getValFromEnv(test, env);
    //add to text
    let preText = '';
    if(checkIfTrue(testAfterSub))
        preText = '<mark style="background-color: green">';
    else  preText = '<mark style="background-color: red">';
    parsedtext = parsedtext + preText + 'else if (' + testAfterSub + '){</mark>\n';
    elseifCon(parsedCode, env, newEnv);

}
function elseifCon(parsedCode, env, newEnv) {
    analyzeJson(parsedCode.alternate.consequent, newEnv);
    parsedtext = parsedtext + '}\n';
    if(parsedCode.alternate.alternate != null) {
        elseifelse(parsedCode, env);
    }
}
function elseifelse(parsedCode, env){
    parsedtext = parsedtext + 'else {\n';
    let newEnv = [];
    for (let i = 0; i < env.length; i++) {
        newEnv.push(env[i]);
    }
    analyzeJson(parsedCode.alternate.alternate, newEnv);
    parsedtext = parsedtext + '}\n';
}

function returnStatementCase(parsedCode, env) {
    let val = ''+analyzeExp(parsedCode.argument, env);
    createLineInTable(parsedCode.loc.start.line,'return statement', '', '', val, env);
    parsedtext = parsedtext + 'return '+ getValFromEnv(val, env)+ ';\n';
}

function forStatementCase(parsedCode, env){
    createLineInTable(parsedCode.loc.start.line,'for statement', '', ''+analyzeExp(parsedCode.test, env), '', env);
}



function analyzeExp(exp, env){
    let ans = '';
    switch(exp.type){
    case 'Literal': ans = ans + exp.value;break;
    case 'Identifier':ans = ans + exp.name; break;
    case 'MemberExpression': ans = ans + memberExp(exp, env);break;
    case 'BinaryExpression': ans = ans + binaryExp(exp, env); break;
    default: ans = ans + analyzeExpCon(exp, env) ;break;
    }
    return ans;
}

function analyzeExpCon(exp, env) {
    let ans = '';
    switch(exp.type) {
    case 'UnaryExpression': ans = ans + unaryExp(exp, env);break;
    case 'LogicalExpression': ans = ans + analyzeExp(exp.left, env)+ ' ' + exp.operator + ' ' + analyzeExp(exp.right, env); break;
        //updateExpression
    default:ans = ans + updateExp(exp);break;
    }
    return ans;
}


function binaryExp(exp, env){
    let analyzeLeft = analyzeExp(exp.left, env);
    let analyzeRight = analyzeExp(exp.right, env);
    return '('+analyzeLeft+' '+ exp.operator +' ' +analyzeRight+')';
}

function memberExp(exp, env){
    return ''+ analyzeExp(exp.object, env) + '[' + analyzeExp(exp.property, env) + ']';
}

function unaryExp(exp, env) {
    return ''+ exp.operator+ analyzeExp(exp.argument, env);
}

function updateExp(exp) {
    if(exp.prefix == true)
        return ''+ exp.operator + exp.argument.name;
    else
        return '' + exp.argument.name+ exp.operator;
}


function getValFromEnv(vari, env) {
    for(let i= env.length-1; i>=0; i--){
        if (vari.includes(env[i]['var'])){
            let val = replaceVar(vari, env[i]['var'],env[i]['val']);
            return getValFromEnv(val, env);
        }
    }
    return vari;
}

function replaceVar(vari, envVar, envVal){
    let ans =  vari.replace(envVar, envVal);
    return ans;
}
