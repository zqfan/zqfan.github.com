---
layout: post
title: "Python Method Binding"
description: ""
category: python
tags: [python]
---
{% include JB/setup %}
# License
this file is published under [CC BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Bind a function

    import types

    class A(object):
        pass

    def f(c):
        print c

    A.f = types.MethodType(f, A, type)
    A.f()

# Bind a class method

    class A(object):
        @classmethod
        def wtf(cls):
            print cls

    class B(object): pass

    print A.wtf
    A.wtf()

    B.wtf = A.wtf
    print B.wtf
    B.wtf()

    # the following two both work, i don't know which is better
    import new
    B.wtf = new.instancemethod(A.wtf.__func__, B, type)
    print B.wtf
    B.wtf()

    import types
    B.wtf = types.MethodType(A.wtf.__func__, B, type)
    print B.wtf
    B.wtf()

# Bind a static method

    class A(object):
    @staticmethod
    def wtf():
        print "wtf"

    class B(object): pass

    B.wtf = staticmethod(A.wtf)
    print B.wtf
    B.wtf()
