---
layout: post
title: "MasslynxSpy User Guide And Update Logs"
description: ""
category: other
tags: []
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## user guide

### pre-condition
this application just based on masslynx 4.1! it cannot work with other versions of masslynx, but you can try :)

because i cannot find APIs of masslynx, this application just run batch processing by simulating manual process, so it is not so automatical that can do something you just think in your head. if you want more functions or details just for you, or bugs are found, contact me by email to zqfan@163com.

### how to use masslynx spy

in current version, you can do your work as follows:

1. put your data files under your project's data directory
1. lunch "masslynx4.1", open your project then open "chromatogram" window
1. set default settings. in current version, you just need to set default smooth settings, which means you should click "smooth chromatogram trace" button(it will not enable if you havn't open a mass chromatogram), then edit "window size" and "number of smooth", and set "smoothing method". masslynx spy will do smoothing automatically with your smoothing setting mentioned above.
1. toggle "processing all traces in current window" and "add/replace new chromatogram" button to set your settings.
1. open a word file which name is "result.doc"
1. lunch masslynx spy, edit channels you want to analyze and click "run" button, the mass chroatogram pictures will flush into result.doc

### how masslynx spy works

i repeat, this application is just a simulation of manual processing.

in current version, it works as follows:

1. focus "chromatogram" window, open a raw directory. raw files are sorted by masslynx with dictionary order, so spy will select raw one by one from the sorted list, make sure every raw are neccesary to analyze. on "chromatogram data browser" window,the radio box "replace" should be selected.
1. click "mass chromatogram" button on "chromatogram" window, focus "function" combo box and select a function from function list  which sorted by "mass chromatogram" window, then select channels you edit on masslynx spy dialog, finally click "ok" button
1. click "reset disply range to default" button on "chromatogram" window
1. click "smooth chromatogram trace" button on "chromatogram" window, use default settings and direcly click "ok" button on "smooth chromatogram" window
1. click "copy a picture of the chromatogram to the clipboard" button on "chromatogram" window
1. focus word window of "result.doc", copy the picture to it
1. if more function is needed to analyze, go to (ii)
1. if more raw file is needed to analyze, go to (i)

### component of masslynx spy dialog

## update logs

  2012-06-20 add "channels" edit box, this allows you to select specific channels which you want to analyze.
  2012-06-19 basic version finished
