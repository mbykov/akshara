# akshara

simple one-line one-word editor for Sanskrit.

Why it is named 'akshara'? Because nagari script is akshara, and not stupid 'abugida'.

Just type nagary from keyboard. Keyboard layout mimics SLP1.

Do not type virama after consonants, it is already typed. To remove virama, hit key 'a' or backspace. To type A-dirgha, hit 'a' again. Vowel in first position is already in a full form.

## Installation

Install with [component(1)](http://component.io):

$ component install mbykov/akshara

## API

````javascript
var akshara = require('mbykov/akshara');
````


````javascript
var oEditor = q('#akshara');
oEditor.contentEditable = true;
akshara.lang('sa').anchor(oEditor).enable();
````


## License

  GNU GPL
