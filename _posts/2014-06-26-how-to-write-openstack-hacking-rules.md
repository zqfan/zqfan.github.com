---
layout: post
title: "How To Write OpenStack Hacking Rules"
description: ""
category: "openstack"
tags: [hacking, pep8]
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

a new check should be numbered, for example, ``H101``, H means Hacking project, first number 1 means it belongs to a specific category (particularly, comments), the last two digits means the number in that category. you'll find the category under hacking/checks direcotry, each file is a category, add your new check to properly file and give it a new hacking number.

hacking project mainly uses doc-test for unit test, so if you're writting function test, you can directly write test in docstring. for example:

~~~ python
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

* ``physical_line``:
  * Raw line of text from the input file
* ``logical_line``:
  * Multi-line statements converted to a single line
  * Stripped left and right
  * Contents of strings replaced with ``"xxx"`` of same length
  * Comments removed
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

here is a full demo:

~~~ python
@core.flake8ext
def hacking_no_locals(logical_line, physical_line, tokens, noqa):
    """Do not use locals() for string formatting.

    Okay: 'locals()'
    Okay: 'locals'
    Okay: locals()
    Okay: print(locals())
    H501: print("%(something)" % locals())
    Okay: print("%(something)" % locals()) # noqa
    """
    if noqa:
        return
    for_formatting = False
    for token_type, text, start, _, _ in tokens:
        if text == "%" and token_type == tokenize.OP:
            for_formatting = True
        if (for_formatting and token_type == tokenize.NAME and text ==
                "locals" and "locals()" in logical_line):
            yield (start[1], "H501: Do not use locals() for string formatting")
~~~

### add check

once the check is done, add it to project install file ``setup.cfg``, you will find example in section of ``entry_points``

then add your new check to ``HACKING.rst``, as the documentation.

finally, run ``tox -epep8,py27``, upload it to gerrit once it succeed


License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
