# akshara

simple one-line one-word editor for Sanskrit.

Why it is named 'akshara'? Because nagari script is akshara, and not supid 'abugida'.

Just type nagary from keyboard. Keyboard layout mimics SLP1. Do not type virama after consonants, it is already typed. To remove virama, hit key 'a' or backspace. To type A-dirgha, hit 'a' again. Vowel in first position is already in a full form.

## Installation

Install with [component(1)](http://component.io):

$ component install mbykov/akshara

## API

````javascript
var akzara = require('mbykov/akzara');
````


````javascript
var oEditor = q('#akzara');
oEditor.contentEditable = true;
akzara.lang('sa').anchor(oEditor).enable();
````


## License

  GNU GPL
