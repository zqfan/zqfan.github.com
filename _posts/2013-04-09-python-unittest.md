---
layout: post
title: "Python unittest"
description: ""
category: Python
tags: [python, unittest]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## Reference
1. [docs.python.org](docs.python.org/2/library/unittest.html)
1. [Steve Purcell](http://pyunit.sourceforge.net/pyunit.html) [中文翻译](http://pyunit.sourceforge.net/pyunit_cn.html)


## Sample

    import unittest
    class MyTest(unittest.TestCase):
        def test_add(self)
            self.assertEqual(1+2, 3)
    unittest.main()

## unittest - 单元测试框架
Steve Purcell的文章有点老，另一方面我更推崇官方的解释
New in version 2.1.

(If you are already familiar with the basic concepts of testing, you might want to skip to the [list of assert methods](http://docs.python.org/2/library/unittest.html#assert-methods).)

如果你已经熟悉了测试的基础概念，你也许想省略以下直接阅读断言方法列表。

The Python unit testing framework, sometimes referred to as “PyUnit,” is a Python language version of JUnit, by Kent Beck and Erich Gamma. JUnit is, in turn, a Java version of Kent’s Smalltalk testing framework. Each is the de facto standard unit testing framework for its respective language.

Python单元测试框架，有时候被称为PyUnit，是Python语言版的JUnit，由Kent Beck和Erich Gamma开发。JUnit又是Kent的Smalltalk测试框架的Java版本。每一个同时又是对应语言的标准测试框架。

unittest supports test automation, sharing of setup and shutdown code for tests, aggregation of tests into collections, and independence of the tests from the reporting framework. The unittest module provides classes that make it easy to support these qualities for a set of tests.

unittest支持自动化测试、在测试中共享启动和停机代码、集合测试以及独立测试。该模块为一系列测试提供许多类，使得以上特性能被容易地支持。

To achieve this, unittest supports some important concepts:

为了达成这些目标，unittest支持一些重要的概念：

* test fixture

A test fixture represents the preparation needed to perform one or more tests, and any associate cleanup actions. This may involve, for example, creating temporary or proxy databases, directories, or starting a server process.

#TODO(zqfan)测试常态代表着一个或多个测试必须进行的准备活动，以及任何相关联的清除动作。这也许包括，举例来说，创建临时或者代理数据库、目录或者启动一个服务器进程。

* test case

A test case is the smallest unit of testing. It checks for a specific response to a particular set of inputs. unittest provides a base class, TestCase, which may be used to create new test cases.

一个测试用例是测试的最小单元。它检查一个特定输入集合的指定的响应。unittest提供了一个基础类，TestCase，用来创建新的测试用例。

* test suite

A test suite is a collection of test cases, test suites, or both. It is used to aggregate tests that should be executed together.

* test runner

A test runner is a component which orchestrates the execution of tests and provides the outcome to the user. The runner may use a graphical interface, a textual interface, or return a special value to indicate the results of executing the tests. 
