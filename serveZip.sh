#!/bin/sh

mkdir ../ziptest
cp dist/a.zip ../ziptest/
cd ../ziptest
unzip a.zip
http-server
