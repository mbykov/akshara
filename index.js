// скопировал из web/Component и пытаюсь запустить

var uniq = require('uniq');
var index = require('indexof');
//var greek = require('./greek').greek;
//var cslav = require('./cslav');
var select = require('select')

var ignored = [999, 0, 8, 9, 12, 13, 16, 17, 18, 20, 27, 35, 36, 37, 38, 40]; // 13 - enter // shift = 16; ctrl = 17; // 46 ?

module.exports = kc();

/*
  греческий сломан, нужно восстановить .seq для комбинаций
*/

function kc() {
    if (!(this instanceof kc)) return new kc();
    this.seq = [];
    return this;
}

var langCode ={
    'la': 'latin',
    'gr': 'greek',
    'sa': 'sanscrit',
    'cs': 'cslav',
    '': '',
}

kc.prototype.lang = function(lcode) {
    //var langName = langCode[lcode] || 'sanskrit';
    //var fn = ['./', langName].join('');
    //log("LANG", lcode, fn, (fn === './sanskrit'));
    var layout = require('./sanskrit'); // WTF? ==== ONLY SANSKRIT FOR NOW ==== не берет из fn
    //var layout = require(fn);
    this.layout = layout;
    return this;
}

kc.prototype.anchor = function(el) {
    var that = this;
    that.el = el;
    var seq = [];
    el.onkeydown = function(e) {
        if (index(ignored, e.which) > 0) return;
        //log('L', e.which, e.shiftKey, e.key, e.altKey);
        that.type(e);
    };
    return this;
}


kc.prototype.type = function(e) {
    if (!this._enabled) return;
    var key = (e.shiftKey && e.altKey) ? 'altShift' : (e.shiftKey) ? 'shift' : (e.altKey) ? 'alt' : 'plain';
    var lett = this.layout[key][e.which];
    if (!lett) return;
    e.preventDefault();

    var lettel = document.createTextNode(lett);
    log('TYPE', lettel.nodeType)
    insertNodeAfterSelection(lettel, e);

    return;

    var el = this.el;
    var pos = e.target.selectionStart;
    var position = window.getSelection().getRangeAt(0).startOffset;
    // for input_text
    //var value = e.target.value;
    var value = e.target.textContent;
    log('VALUE', value, pos, position, lett);
    pos = position +1;
    //el.value = [value.substring(0, pos), lett, value.substring(pos)].join('');
    //el.textContent = [value.substring(0, pos), lett, value.substring(pos)].join('');
    // FIXME: это нужно привести в порядок, и position не кроссплатф, взять из public/ks.js
    el.textContent = [el.textContent, lett].join('');
    select(el, pos, pos);
    //el.setSelectionRange(pos+1, pos+1);
}


function insertNodeAfterSelection(node, evt) {
    var sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.collapse(false);
            range.insertNode(node);
        }
        // http://stackoverflow.com/questions/12920225/text-selection-in-divcontenteditable-when-double-click
        // http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
        // http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
        range.setStart(evt.rangeParent, evt.rangeOffset);
        range.collapse(true);
        var savedRange = range;
        sel.removeAllRanges();
        sel.addRange(savedRange);

    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.collapse(false);
        html = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(html);
    }
}


kc.prototype.enable = function() {
    this._enabled = true;
}

kc.prototype.disable = function() {
    this._enabled = false;
}

function log () { console.log.apply(console, arguments) }
