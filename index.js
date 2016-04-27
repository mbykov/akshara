/*
 simple one-line, on-line editor for for Nagari scripting, i.e. for Sanskrit
*/

var ignored = [999, 0, 8, 9, 12, 13, 16, 17, 18, 20, 27, 35, 36, 37, 38, 40]; // 13 - enter // shift = 16; ctrl = 17;

module.exports = akshara();

/*
   greek is broken, .seq should be restored for combined greek syms
*/

function akshara() {
    if (!(this instanceof akshara)) return new akshara();
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


akshara.prototype.lang = function(lcode) {
    //var layout = require(fn);
    var layout = require('./sanskrit'); // ==== ONLY SANSKRIT FOR NOW ====
    this.layout = layout;
    return this;
}

akshara.prototype.anchor = function(el) {
    var that = this;
    that.el = el;
    var seq = [];
    el.onkeydown = function(e) {
        if (ignored.indexOf(e.which) > 0) return;
        that.type(e);
    };
    return this;
}

akshara.prototype.type = function(e) {
    if (!this._enabled) return;
    if(e.ctrlKey) return;
    var key = (e.shiftKey && e.altKey) ? 'altShift' : (e.shiftKey) ? 'shift' : (e.altKey) ? 'alt' : 'plain';
    var lett = this.layout[key][e.which];
    if (!lett) return;
    e.preventDefault();
    var lettel = document.createTextNode(lett);
    // insertNodeAfterSelection(lettel, e);
    log('LETT', lett)

}


function insertNodeAfterSelection(node, evt) {
    var sel, range, html;
    // var x = evt.clientX, y = evt.clientY;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.collapse(false);
            range.insertNode(node);
            range.setStartAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        // http://stackoverflow.com/questions/12920225/text-selection-in-divcontenteditable-when-double-click
        // http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
        // http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
        // http://stackoverflow.com/questions/2213961/selection-ranges-in-webkit-safari-chrome <==

    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.collapse(false);
        html = (node.nodeType == 3) ? node.data : node.outerHTML;
        range.pasteHTML(html);
    }
}


akshara.prototype.enable = function() {
    this._enabled = true;
}

akshara.prototype.disable = function() {
    this._enabled = false;
}

function log () { console.log.apply(console, arguments) }

function q(sel) {
    return document.querySelector(sel);
}

function qs(sel) {
    return document.querySelectorAll(sel);
}
