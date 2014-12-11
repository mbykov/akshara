// скопировал из web/Component и пытаюсь запустить
var uniq = require('uniq');
var index = require('indexof');
//var greek = require('./greek').greek;
//var cslav = require('./cslav');

var ignored = [999, 0, 8, 9, 12, 13, 16, 17, 18, 20, 27, 35, 36, 37, 38, 40]; // 13 - enter // shift = 16; ctrl = 17; // 46 ?

/*
  в сухом остатке -
  keydown дает код полностью, если отслеживать e.shiftKey
  но на русской раскладке э-ж дают ноль, увы
*/

module.exports = kc();

function kc() {
    if (!(this instanceof kc)) return new kc();
    this.seq = [];
    log('KC START');
    return this;
}

kc.prototype.lang = function(lcode) {
    var langName = langCode[lcode] || 'sanskrit';
    var fn = ['./', langName].join('');
    //log("LANG", lcode, fn, (fn === './sanskrit'));
    var layout = require('./sanskrit'); // WTF? ==== ONLY SANSKRIT FOR NOW ====
    //var layout = require(fn);
    this.layout = layout;
    return this;
}

kc.prototype.anchor = function(el) {
    //log("SET anchor");
    //if (!this._enabled) return;
    var that = this;
    var seq = [];
    el.onkeydown = function(e) {
        if (index(ignored, e.which) > 0) return;
        // if (e.which == 16) seq.push("shift");
        // that.seq = uniq(seq);
        //log('SHIFT', that.seq);
        log('L', e.which, e.shiftKey, e.key);
        that.type(e);
    };
    // el.onkeypress = function(e) {
    //     if (index(ignored, e.which) > 0) return;
    //     that.type(e);
    // };
    return this;
}

kc.prototype.type = function(e) {
    var lett = this.layout[e.shiftKey][e.which];
    if (!lett) return;
    e.preventDefault();
    log("TYPE", this.seq, lett, e.shiftKey);
    var pos = e.target.selectionStart;
    var value = e.target.value;
    el.value = [value.substring(0, pos), lett, value.substring(pos)].join('');
    el.setSelectionRange(pos+1, pos+1);
}

kc.prototype.OLD_TYPE = function(el) {
    log("SET anchor");
    this.seq = [];
    var that = this;
    el.onkeydown = function(e) {
        if (e.which == 16) that.seq.push("shift");
        //log('SHIFT', that.seq, e.shiftKey);
    };
    el.onkeydown = function(e) {
        //if (index(ignored, e.which) > 0) return;
        var seq = [];
        var lett = letter(that.layout, seq, e);
        if (!lett) return;
        e.preventDefault();
        var pos = e.target.selectionStart;
        var value = e.target.value;
        el.value = [value.substring(0, pos), lett, value.substring(pos)].join('');
        el.setSelectionRange(pos+1, pos+1);
    };
}


function letter(layout, seq, e) {
    var charkey = seq.concat(String.fromCharCode(e.which)).join('-'); //.replace(/^-/,'');
    if (!layout[charkey]) return false;
    var charcode = ['0x', layout[charkey]].join('');
    var letter = String.fromCharCode(parseInt(charcode, 16));
    if (e.which == 32) letter = ' ';
    log('L', e.which, charkey, charcode, letter, e.shiftKey);
    return letter;
}

function getLayout(lang) {
    var path = './' + lang;
    var layout = require(path);
    return layout;
}

var langCode = {
    'gr': 'greek',
    'sa': 'sanskrit',
    'la': 'latin',
    'cs': 'cslav',
    '': '',
}


kc.prototype.enable = function() {
    this._enabled = true;
    log("KC enabled", this._enabled);
}

kc.prototype.disable = function() {
    this._enabled = false;
    log("KC seq", this._enabled);
}

kc.prototype.mod = function(e, mod) {
    this.seq.push(mod);
    e.preventDefault();
}

function log () { console.log.apply(console, arguments) }
