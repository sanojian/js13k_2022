#!/bin/bash

###########################
# clean

rm dist/*.html dist/*.zip dist/*.js dist/*.png dist/js/

exit


###########################
# procesMap


###########################
# imageProd


###########################
# concatShared


###########################
# concatProd


###########################
# closureComp


###########################
# uglify



#grunt prod --force

###########################
# roadroller

npx roadroller  --optimize 2 dist/i.min.js -o dist/i.min.js
#npx roadroller  --optimize O dist/i.min.js -o dist/i.min.js


###########################
# rollup

grunt rollup

###########################
# zip

cd dist
zip -X9 a.zip index.html t.png 
npx advzip-bin --recompress -4 a.zip
ls -la a.zip


###########################
# check size

z=$(wc -c < a.zip)

if [ $z -ge 13312 ]
then
        echo "NOOOO !! zip size ($z) is bigger than target (13312)  :("
else
        echo "YES, zip size ($z) is below target (13312)  :)"
fi

