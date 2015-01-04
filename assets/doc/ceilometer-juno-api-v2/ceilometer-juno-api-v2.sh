#! /usr/bin/env bash
name=`basename $0`
name=${name%*.sh}
pandoc "$name".md ../xls.js -c ../jquery-ui-1.10.2.min.css -c ../xlstablefilter-1.0.1.css -c ../doc.css --number-sections --toc -o index.html
