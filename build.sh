#!/bin/bash

grunt prod --force

npx uglifyjs dist/js/i.js  --compress unsafe --mangle --toplevel > dist/i.ugly.js

npx roadroller  --optimize 2 dist/i.ugly.js -o dist/i.roadrolled.js

## Run roadroller with "--optimize O" to make it run forever ... or until you press ctrl-c
#npx roadroller  --optimize O dist/i.ugly.js -o dist/i.roadrolled.js

# roll html and js in to one one index.html file
grunt rollup

########## Pack

cd dist
zip -X9 a.zip index.html t.png 
npx advzip-bin --recompress -4 -i 1000 a.zip
ls -la a.zip

########## Test

z=$(wc -c < a.zip)

if [ $z -ge 13312 ]
then
        echo "NOOOO !! zip size ($z) is bigger than target (13312)  :("
else
        echo "YES, zip size ($z) is below target (13312)  :)"
fi
