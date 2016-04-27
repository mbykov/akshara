# akshara

simple one-line one-word editor for Sanskrit.
why it is named 'akshara'? Because nagari script is akshara, and not supid 'abugida'

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
