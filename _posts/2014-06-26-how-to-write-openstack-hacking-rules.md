---
layout: post
title: "How To Write OpenStack Hacking Rules"
description: ""
category: ""
tags: []
---
{% include JB/setup %}
Some OpenStack contributors may be asked to write new hacking rule when they try to fix bugs, this post introduces basic knowlege for it.

### register a new bug

hacking projects doesn't have blueprints tracking system, so you'll need to report a bug for it before adding a new check. see: [https://bugs.launchpad.net/hacking/](https://bugs.launchpad.net/hacking/)

### write check

each check in hacking is just a flake8 extension, it could be a function or class. there are lots of examples in hacking project itself, you should read all of them to get familiar with it. they are all under hacking/checks directory, which will be your start place too.

you need to read documents for flake8 and pep8, here I recommend two links:

* [https://flake8.readthedocs.org](https://flake8.readthedocs.org)
* [https://github.com/jcrocholl/pep8/blob/master/docs/developer.rst](https://github.com/jcrocholl/pep8/blob/master/docs/developer.rst)

a new check should be numbered, and they are categoried by types, you'll find the category under hacking/checks direcotry, each file is a category, add your new check to properly file and give it a new hacking number.

hacking project mainly uses doc-test for unit test, so if you're writting function test, you can directly write test in docstring. for example:

~~~
r"""Check for 'TODO()'.

OpenStack HACKING guide recommendation for TODO:
Include your name with TODOs as in "# TODO(termie)"

Okay: # TODO(sdague)
H101: # TODO fail
H101: # TODO
H101: # TODO (jogo) fail
Okay: TODO = 5
"""
~~~

Okay indicates such statements are valid, and the rule number indicates wrong scenario. note the comma: is important, if it is missed, then the single test will not be executed, you will see such docstring in some check.

if the check is a class or it cannot be tested via docstring, you will need add particular unit test code for the new check.

for function test case, the arguments of funtion could be different, but their name is solid, here is the list:

* ``lines``: a list of the raw lines from the input file
* ``tokens``: the tokens that contribute to this logical line
* ``line_number``: line number in the input file
* ``total_lines``: number of lines in the input file
* ``blank_lines``: blank lines before this one
* ``indent_char``: indentation character in this file (``" "`` or ``"\t"``)
* ``indent_level``: indentation (with tabs expanded to multiples of 8)
* ``previous_indent_level``: indentation on previous line
* ``previous_logical``: previous logical line

the tokens is a list of:

* token type: which is defined in tokenize module
* text: token content
* start index: token start (line, col)
* end index: token end (line, col)
* line: content of line which token is in

and note that, since only one parameter of physical_line and logical_line can be used, you will need return (col, message) for physical_line or yield it for logical_line

anything uncertain, read the [docs](https://github.com/jcrocholl/pep8/blob/master/docs/developer.rst) again

### add check

once the check is done, add it to project install file ``setup.cfg``, you will find example in section of ``entry_points``

then add your new check to ``HACKING.rst``, as the documentation.

finally, run ``tox -epep8,py27``, upload it to gerrit once it succeed


License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)