---
layout: post
title: "Python Descriptor"
description: ""
category: python
tags: [python, descriptor]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Reference
1. [http://docs.python.org/2/howto/descriptor.html](http://docs.python.org/2/howto/descriptor.html)

# Example
When I read quantum source code, there is a getattr behaviour strangely, so i write some test code as following, if you don't know what it is doing, you should read the reference.

    class A(object):
        def __init__(self, factory):
            self.f = factory

        def __get__(self, obj, cls):
            print self, obj, cls
            return self.f(obj)

        def method(self):
            print "in A.method"

    class B(object):
        def method(self):
            print "in B.method"

    def f(obj):
        print "in function"
        return B()

    class C(object):
        c = A(f)

        def method(self):
            print "in C.method"

    q = C()
    getattr(q, "method")()
    print "="*16
    getattr(q.c, "method")()
    print "="*16
    a = A(f)
    getattr(a, "method")()

# Hint
1. q.c equals `q.__dict__['c'].__get__(q, C)`
