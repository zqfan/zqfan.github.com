---
layout: post
title: "Python NotImplemented Comparison"
description: ""
category: python
tags: []
---
NotImplemented is a special singleton class in python, it will be returned when comparison doesn't know how to deal with current compared objects, then a futher operation can be taken by invoker.

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

Here is some [source code](https://github.com/openstack/oslo-incubator/blob/master/openstack/common/apiclient/base.py) from openstack oslo-incubator:

{% highlight python linenos=table %}
class Resource(object):
    def __eq__(self, other):
        if not isinstance(other, Resource):
            return NotImplemented
        # two resources of different types are not equal
        if not isinstance(other, self.__class__):
            return False
        if hasattr(self, 'id') and hasattr(other, 'id'):
            return self.id == other.id
        return self._info == other._info
{% endhighlight %}

At first glance, I thought it is a bug, because line 6 will never reach. Then I realized that `__class__` can be sub class of Resource, so there must be some unordinary things inside. After google and run this test, I found the root cause:

{% highlight python linenos=table %}
#! /usr/bin/env python

class A(object):
    def __eq__(self, other):
        if not isinstance(other, A):
            return NotImplemented
        if not isinstance(other, self.__class__):
            print 'result returned by class A: ',
            return False
        else:
            return True

class B(object):
    def __eq__(self, other):
        if not isinstance(other, B):
            print 'result returned by class B: ',
            return False
        return True

class C(A):
    pass


print 'A() == B(), ', A() == B()
print 'A() == C(), ', A() == C()
{% endhighlight %}

The console output is

    A() == B(),  result returned by class B:  False
    A() == C(),  result returned by class A:  False

According to the test, if object of class A can not recognize the type of right operand, then it will return a singleton object NotImplemented, then the right operand will invoke it's comparison method.

It is common behaviour in all object rich comparison, which means `__eq__`, `__lt__`, and etc. This is designed for sequence operation, for i.e., sort, filter, map, and etc. If we raise NotImplementedError exception, then operation will be interrupted. The NotImplemented object will notify the invoker that the current object cannot decide what to do with the right operand, and the invoker can do futher action to manipulate comprison.

ref:
1. [http://docs.python.org/2/reference/datamodel.html#coercion-rules](http://docs.python.org/2/reference/datamodel.html#coercion-rules)
1. [http://docs.python.org/2/library/constants.html#NotImplemented](http://docs.python.org/2/library/constants.html#NotImplemented)
1. [How to override comparison operators in Python](http://jcalderone.livejournal.com/32837.html#)
