start: clean build

# build: components index.js
# 	@component build --dev

build: components index.js
	@duo index.js

components: component.json
	@component install --dev

clean:
	rm -fr build

# clean:
# 	rm -fr build components

.PHONY: clean
