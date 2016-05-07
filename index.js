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

var c = {};
c.virama = '्';
c.plainCons = [66, 71, 68, 90, 72, 75, 76, 77, 78, 80, 82, 87, 81, 83, 84, 86, 89, 67, 74 ];
c.shiftCons = [ 66, 71, 68, 75, 76, 78, 80, 82, 87, 81, 83, 84, 89, 67, 74 ];
c.a = 65;
c.vows = [65,69,85,73,79,70,88];

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
        // log('EV', e.which)
        if (ignored.indexOf(e.which) > 0) return;
        that.type(e);
    };
    return this;
}

// backspace = 8
akshara.prototype.type = function(e) {
    if (!this._enabled) return;
    if(e.ctrlKey) return;
    var key = (e.shiftKey && e.altKey) ? 'altShift' : (e.shiftKey) ? 'shift' : (e.altKey) ? 'alt' : 'plain';
    var lett = this.layout[key][e.which];
    if (!lett) return;
    e.preventDefault();
    var letvir = [lett, c.virama].join('');
    if (key == 'plain' && inc(c.plainCons, e.which)) lett = letvir;
    if (key == 'shift' && inc(c.shiftCons, e.which)) lett = letvir;
    // log('lett', key, lett, letvir, inc(c.plainCons, e.which), 'WHICH', e.which, 'CONS', c.plainCons);
    var oEd = q('#akshara');
    var text = oEd.textContent;
    var fin = text[text.length-1];
    if (text.length == 0 && inc(c.vows, e.which)) lett = this.layout['alt'][e.which];
    if (text.length > 0 && fin == c.virama && inc(c.vows, e.which)) {
        removeVirama(e);
        if (e.which == c.a) {
            e.preventDefault();
            return false;
        }
    }
    var lettel = document.createTextNode(lett);
    insertNodeAfterSelection(lettel, e);
}

function removeVirama(e) {
    var oEd = q('#akshara');
    var text = oEd.textContent;
    text = text.slice(0, -1);
    oEd.textContent = text;
    // e.preventDefault();
    oEd.focus();
    var range = document.createRange();
    range.selectNodeContents(oEd);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function insertNodeAfterSelection(node, evt) {
    var sel, range, html;
    var element = document.getElementById('akshara');
    // var caretOffset = 0;
    // var x = evt.clientX, y = evt.clientY;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.collapse(false);
            range.insertNode(node);
            range.setStartAfter(node);
            // range.collapse(false);
            // sel.removeAllRanges();
            // sel.addRange(range);
            // return;

            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            // caretOffset = preCaretRange.toString().length;
            // caretOffset = preCaretRange.toString();
            var startText = preCaretRange.toString();
            var oStart = document.createTextNode(startText);
            // log('startText', startText);

            range.setEndAfter(node);
            range.setStart(element, 0);
            range.deleteContents();
            range.collapse(false);
            range.insertNode(oStart);
            range.setStartAfter(oStart);
            sel.removeAllRanges();
            sel.addRange(range);
            // range.setEndAfter(oStart);
            // range.collapse(false);
        }
        // http://stackoverflow.com/questions/12920225/text-selection-in-divcontenteditable-when-double-click
        // http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
        // http://stackoverflow.com/questions/1181700/set-cursor-position-on-contenteditable-div
        // http://stackoverflow.com/questions/2213961/selection-ranges-in-webkit-safari-chrome <=======
        // http://stackoverflow.com/questions/20760987/how-to-get-text-from-contenteditable-div-from-beginning-to-the-cursor-position

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

function inc(arr, item) {
    return (arr.indexOf(item) > -1) ? true : false;
}
