import $ from 'jquery';
import {deleteTable, parseText} from './code-analyzer';
//insert delete and get

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        initText();
        let codeToParse = $('#codePlaceholder').val();
        let valforColors =  $('#valPlaceholder').val();
        let valMap = valsToMap(valforColors);
        let newTxtAfterParse = parseText(codeToParse, valMap);
        let finalText = '<p> ';
        let splitText = newTxtAfterParse.split('\n');
        for(let i=0; i<splitText.length; i++){
            finalText = finalText + '<br>' + splitText[i] + '</br>';
        }
        finalText = finalText +'</p> ';
        document.getElementById('parsedCode').innerHTML = finalText;
    });
});

function initText() {
    deleteTable();
}
//((valforColors === undefined) || (valforColors == null) || (valforColors == "undefined") ||
//val of colors = (x=1,y=2,...)
//return : [{var:x, val:1}, {var:y, val:2}, ...]
function valsToMap(valforColors) {
    let ans = [];
    if  ((valforColors == '()') || (valforColors === '()')) {
        return ans;
    }
    else{
        valsToMapNotEmpty(valforColors);
    }
}

function valsToMapNotEmpty(valforColors) {
    let ans = [];
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
