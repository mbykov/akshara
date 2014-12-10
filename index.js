// скопировал из web/Component и пытаюсь запустить
var uniq = require('uniq');
var index = require('indexof');
//var greek = require('./greek').greek;
//var cslav = require('./cslav');

var ignored = [999, 0, 8, 9, 12, 13, 16, 17, 18, 20, 27, 35, 36, 37, 38, 40]; // 13 - enter // shift = 16; ctrl = 17;

// 46 ?

module.exports = kc();

function kc() {
    if (!(this instanceof kc)) return new kc();
    this.seq = [];
    //var self = this;
    //var layout = getLayout(lang);
    // el.onkeypress = function(e) {
    //     log('P', e.which)
    // };
}

function getLayout(lang) {
    var path = './' + lang;
    var layout = require(path);
    return layout;
}

kc.prototype.lang = function(lang) {
    log("LANG", this.seq);
    var greek = require('./greek.js');
    this.layout = greek;
    return this;
}

kc.prototype.anchor = function(el) {
    log("SET");
    var that = this;
    el.onkeydown = function(e) {
        if (index(ignored, e.which) > 0) return;
        var seq = [];
        var lett = letter(that.layout, seq, e);
        if (!lett) return;
        e.preventDefault();
        var pos = e.target.selectionStart;
        var value = e.target.value;
        el.value = [value.substring(0, pos), lett, value.substring(pos)].join('');
        el.setSelectionRange(pos+1, pos+1);
    };
    this.seq = [];
    return this;
}


function letter(layout, seq, e) {
    var charkey = uniq(seq).concat(String.fromCharCode(e.which)).join('-').replace(/^-/,'');
    if (!layout[charkey]) return false;
    var charcode = ['0x', layout[charkey]].join('');
    var letter = String.fromCharCode(parseInt(charcode, 16));
    if (e.which == 32) letter = ' ';
    log('L', e.which, charkey, charcode, letter);
    return letter;
}

kc.prototype.type = function(e) {
    log("TYPE", this.seq);
    this.seq = [];
}


kc.prototype.enable = function() {
    this._enabled = true;
    //log("KC", this._enabled);
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
