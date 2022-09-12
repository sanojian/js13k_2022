#!/bin/bash

grunt prod --force
npx roadroller  --optimize 2 dist/i.min.js -o dist/i.min.js
#npx roadroller  --optimize O dist/i.min.js -o dist/i.min.js
grunt rollup

cd dist
zip -X9 a.zip index.html t.png 
npx advzip-bin --recompress -4 a.zip
ls -la a.zip

z=$(wc -c < a.zip)

if [ $z -ge 13312 ]
then
        echo "NOOOO !! zip size ($z) is bigger than target (13312)  :("
else
        echo "YES, zip size ($z) is below target (13312)  :)"
fi

# With optimize 2: 13281, 13278, 13265 
# without: 13286, 13295, 13281

