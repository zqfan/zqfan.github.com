---
layout: post
title: "cPickle A faster pickle"
description: ""
category: python
tags: [pickle]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

when i read "wxPython Action", i find the cPickle module. from this
http://docs.python.org/release/2.5/lib/module-cPickle.html

says that:

The cPickle module supports serialization and de-serialization of Python objects, providing an interface and functionality nearly identical to the pickle module. There are several differences, the most important being performance and subclassability.

First, cPickle can be up to 1000 times faster than pickle because the former is implemented in C. Second, in the cPickle module the callables Pickler() and Unpickler() are functions, not classes. This means that you cannot use them to derive custom pickling and unpickling subclasses. Most applications have no need for this functionality and should benefit from the greatly improved performance of the cPickle module.

The pickle data stream produced by pickle and cPickle are identical, so it is possible to use pickle and cPickle interchangeably with existing pickles.13.10

There are additional minor differences in API between cPickle and pickle, however for most applications, they are interchangeable. More documentation is provided in the pickle module documentation, which includes a list of the documented differences.

the python help shows that:
* dump(obj, file, protocol=0) -- Write an object in pickle format to the given file.
* dumps(obj, protocol=0) -- Return a string containing an object in pickle format.
* load(file) -- Load a pickle from the given file
* loads(string) -- Load a pickle from the given string
