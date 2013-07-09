---
layout: post
title: "Book Learning Python"
description: ""
category: book
tags: [python, learning python]
---
{% include JB/setup %}
## License
this file is published under [CC BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## tips
### iterate dict by order

    ks = d.keys()
    ks.sort()
    for key in ks:
        do_sth(d[key])

or you can be pythonic:

    for key in sorted(d):
        do_sth(d[key])

### slice
L\[I:J:K\], default k is 1, you can specific a step, if k is negative, then it will reverse and slice it, so l.reverse() is equal to l\[::-1\]

### ascii code
* ord('a')
* chr(97)

### 增强赋值
增强赋值是做原处修改，对于列表和字典将会导致共享引用的问题

    >>> L = [1,2]
    >>> M = L
    >>> L = L + [3,4]
    >>> L,M
    ([1, 2, 3, 4], [1, 2])
    >>> L = [1,2]
    >>> M = L
    >>> L += [3,4]
    >>> L,M
    ([1, 2, 3, 4], [1, 2, 3, 4])

### print to file
Since print(x) can simply equal to sys.stdout.write(str(x)+'\n'), you can set sys.stdout to any object has interface write, then all print will send to that object. But if you want to both print to file and console, you can use >> to redirect output.

    >>> log = open("log.txt","a")
    >>> print >> log, message1, message2

### file iterator
x.next() -> the next value, or raise StopIteration

    with open("somefile") as f:
        for line in f:
            do_sth(line)

It is simple, fast and better for memory space. Pythonic!

### zip and map

    >>> keys = ["a","b","c"]
    >>> values = [1,2,3,4]
    >>> zip(keys,values)
    [('a', 1), ('b', 2), ('c', 3)]
    >>> map(None,keys,values)
    [('a', 1), ('b', 2), ('c', 3), (None, 4)]
    >>> dict(zip(keys,values))
    {'a': 1, 'c': 3, 'b': 2}

### enumerate

    >>> s = "happy"
    >>> for (pos, value) in enumerate(s):
    ...     print pos, value
    ...
    0 h
    1 a
    2 p
    3 p
    4 y

### python app release tool
* py2exe
* pyInstaller
* freeze
* .zip (support encrypt)
* distutils
* python eggs

### Vaults of Parnassus
Unfortunately the page is inactive at the the time of this writing (Feb 25, 2012).

If you were looking for a python package library you should go over here: [pypi](http://pypi.python.org/pypi)
