---
layout: post
title: "org reveal"
description: ""
category: "other"
tags: []
---
[The org-reveal user guide](https://github.com/yjwen/org-reveal/blob/master/Readme.org) is already very good, but here you may meet some problems which i have already solved, so you can directly try it!

# Installation

## org-mode is lower than 8.0
Since org-reveal use ox-html, so you must upgrade org-mode to 8.0, if you are using emacs 24 such as I am, you can directly run `M-x package-install RET org`, then it will upgrade automatically.

## slime.elc:Error: Don't know how to compile nil

Upgrade slime to newest version will solve this problem, like upgrade org-mode, you can run `M-x package-install RET slime` in emacs, then this complain will disappear.

## symbol's function definition is void slime-fuzzy-init

Run `M-x load-library RET slime` in emacs.

# Usage

## reveal.js cdn

`#+REVEAL_ROOT: //cdn.jsdelivr.net/reveal.js/2.5.0/` in the guide doesn't work, actually the right specification is `#+REVEAL_ROOT: http://cdn.jsdelivr.net/reveal.js/2.5.0/`

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
