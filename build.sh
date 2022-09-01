#!/bin/sh

grunt prod --force
npx roadroller --optimize 2 dist/i.min.js -o dist/i.min.js
grunt rollup
cd dist
zip -X9 a.zip index.html t.png 
npx advzip-bin --recompress -4 a.zip