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

kc.prototype.enable = function() {
    this._enabled = true;
}

kc.prototype.disable = function() {
    this._enabled = false;
}

function log () { console.log.apply(console, arguments) }
