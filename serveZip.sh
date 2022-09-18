#!/bin/sh

rm -rf ziptest
mkdir ziptest
cp dist/a.zip ziptest/
cd ziptest
unzip -o a.zip
http-server
