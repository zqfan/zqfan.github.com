#! /usr/bin/env bash
name=`basename $0`
name=${name%*.sh}
pandoc "$name.md" ./jekyll.md -c ./doc.css --number-sections -o "$name.html"
