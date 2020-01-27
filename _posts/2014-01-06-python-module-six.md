---
layout: post
title: "Python Module: Six"
description: ""
category: "python"
tags: [six]
---
Six is a Python 2 and 3 compatibility library. It provides utility functions for smoothing over the differences between the Python versions with the goal of writing Python code that is compatible on both Python versions. Six supports every Python version since 2.5. [0][0]

The name, “six”, comes from the fact that 2\*3 equals 6. Why not addition? Multiplication is more powerful, and, anyway, “five” has already been snatched away by the Zope Five project. [1][1]

So, if there is a compatability problem, you must use try-except import style to solve it:

{% highlight python linenos=table %}
try:
    from io import StringIO
except ImportError:
    from cStringIO import StringIO
{% endhighlight %}

Or you can get help form the amazing module six to do the dirty job for you:

{% highlight python linenos=table %}
from six.moves import cStringIO
{% endhighlight %}

To keep the code consistent

{% highlight python linenos=table %}
from six.moves import cStringIO as StringIO
{% endhighlight %}

Personally, I think it doesn't provide so much conveniency, because we still need to worry about which module has version problem. However, it simplifies the ugly import code and provides a standard way to solve such kind of problem, why don't use it.

There are several major problem you will meet for python version problem, you can read [six documents][1] or [Reorganizations and renamings][3] for more detail, here I just list the usage in OpenStack (as much as I've already come across)

### Renamed modules and attributes compatibility
six, python2, python3, gerrit review
* range, xrange, range
* cStringIO, cStringIO.StringIO, io.StringIO, [https://review.openstack.org/#/c/41615/][2]

[0]: https://pypi.python.org/pypi/six
[1]: http://pythonhosted.org/six/
[2]: https://review.openstack.org/#/c/41615/
[3]: http://python3porting.com/stdlib.html

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
