---
layout: post
title: "Python unittest"
description: ""
category: python
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

python 2.1中新加

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

测试固件代表着一个或多个测试必须进行的准备活动，以及任何相关联的清除动作。这也许包括，举例来说，创建临时或者代理数据库、目录或者启动一个服务器进程。

* test case

A test case is the smallest unit of testing. It checks for a specific response to a particular set of inputs. unittest provides a base class, TestCase, which may be used to create new test cases.

测试用例是测试的最小单元。它检查一个特定输入集合的指定的响应。unittest提供了一个基础类，TestCase，用来创建新的测试用例。

* test suite

A test suite is a collection of test cases, test suites, or both. It is used to aggregate tests that should be executed together.

测试套件是测试、测试套件或者两者的集合。它被用来集成那些应当被一起执行的测试。

* test runner

A test runner is a component which orchestrates the execution of tests and provides the outcome to the user. The runner may use a graphical interface, a textual interface, or return a special value to indicate the results of executing the tests.

测试执行器是一个组件，它精心安排测试的执行，并且给用户提供了结果。执行器也许使用图形界面、文本界面或者返回一个特殊的值用以标示测试的执行结果。

The test case and test fixture concepts are supported through the TestCase and FunctionTestCase classes; the former should be used when creating new tests, and the latter can be used when integrating existing test code with a unittest-driven framework. When building test fixtures using TestCase, the setUp() and tearDown() methods can be overridden to provide initialization and cleanup for the fixture. With FunctionTestCase, existing functions can be passed to the constructor for these purposes. When the test is run, the fixture initialization is run first; if it succeeds, the cleanup method is run after the test has been executed, regardless of the outcome of the test. Each instance of the TestCase will only be used to run a single test method, so a new fixture is created for each test.

测试用例和测试固件的概念是通过TestCase和FunctionTestCase来支持的；TestCase应当被使用在创建新的测试用例时，FunctionTestCase能被使用在基于unittest驱动的测试框架集成现有测试代码的场合。当使用TestCase构建测试固件时，setUp()和tearDown()方法能被重载以便为固件提供初始化和清除。通过FunctionTestCase，为了这些目的，现有的函数能被传递到构造器。当测试运行时，固件初始化首先被运行，如果成功，清除函数将在测试被执行完毕后运行不论结果如何。每一个Testase的实例将只会被用于执行一次单独的测试方法，所以会为每一个特测创建一个新的固件。

Test suites are implemented by the TestSuite class. This class allows individual tests and test suites to be aggregated; when the suite is executed, all tests added directly to the suite and in “child” test suites are run.

测试套件是由TestSuite类实现的。这个类允许独立测试和测试套件集成在一起；当套件被执行时，所有运行的测试被直接添加到套件中并且位于子测试套件。

A test runner is an object that provides a single method, run(), which accepts a TestCase or TestSuite object as a parameter, and returns a result object. The class TestResult is provided for use as the result object. unittest provides the TextTestRunner as an example test runner which reports test results on the standard error stream by default. Alternate runners can be implemented for other environments (such as graphical environments) without any need to derive from a specific class.

测试执行器是一个对象，提供了单独的方法，run\(\)，该方法接受一个TestCase或者TestSuite对象作为参数，并且返回一个结果对象。类TestResult被提供充作结果对象。unittest提供TextTestRunner作为一个测试执行器的例子，它默认在标准错误流中报告测试结果。另外的执行器能为其他环境（例如图形环境）实现而不需要继承某一个指定类。

### 25.3.1 基本例子
The unittest module provides a rich set of tools for constructing and running tests. This section demonstrates that a small subset of the tools suffice to meet the needs of most users.

unittest模块提供了丰富的工具集以创建和执行测试。本段演示了工具中对于大多数使用者来说已经足够了的一个小子集。

Here is a short script to test three functions from the random module:

这个短小的脚本测试了三个random模块中的函数：

    import random
    import unittest

    class TestSequenceFunctions(unittest.TestCase):

        def setUp(self):
            self.seq = range(10)

        def test_shuffle(self):
            # make sure the shuffled sequence does not lose any elements
            random.shuffle(self.seq)
            self.seq.sort()
            self.assertEqual(self.seq, range(10))

            # should raise an exception for an immutable sequence
            self.assertRaises(TypeError, random.shuffle, (1,2,3))

        def test_choice(self):
            element = random.choice(self.seq)
            self.assertTrue(element in self.seq)

        def test_sample(self):
            with self.assertRaises(ValueError):
                random.sample(self.seq, 20)
            for element in random.sample(self.seq, 5):
                self.assertTrue(element in self.seq)

    if __name__ == '__main__':
        unittest.main()

A testcase is created by subclassing unittest.TestCase. The three individual tests are defined with methods whose names start with the letters test. This naming convention informs the test runner about which methods represent tests.

这个测试例子子类化了unittest.TestCase。三个独立的测试被定义成名称以test开头的函数。这个命名惯例通知测试执行器哪些方法代表了测试。

The crux of each test is a call to assertEqual() to check for an expected result; assertTrue() to verify a condition; or assertRaises() to verify that an expected exception gets raised. These methods are used instead of the assert statement so the test runner can accumulate all test results and produce a report.

每个测试的关键点是调用assertEqual()来检查预期的结果；assertTrue()检验状态；assertRaises()检验预期的被抛出的异常。这些方法被用来代替assert语句，这样测试执行器能累计所有的测试结果并且生成报告。

When a setUp() method is defined, the test runner will run that method prior to each test. Likewise, if a tearDown() method is defined, the test runner will invoke that method after each test. In the example, setUp() was used to create a fresh sequence for each test.

当setUp()方法被定义时，测试执行器将在每一个测试之前执行这个方法。同样的，如果tearDown()方法被定义，测试执行器将在每一个测试之后调用这个方法。在这个例子中，setUp()方法被用来为每一个测试创建新的序列。

The final block shows a simple way to run the tests. unittest.main() provides a command-line interface to the test script. When run from the command line, the above script produces an output that looks like this:

最后的语句块展示了运行这些测试的简单方法。unittest.main()提供了命令行接口给测试脚本。当从命令行运行时，上面的脚本生成如下的输出：

    ...
    ----------------------------------------------------------------------
    Ran 3 tests in 0.000s

    OK

Instead of unittest.main(), there are other ways to run the tests with a finer level of control, less terse output, and no requirement to be run from the command line. For example, the last two lines may be replaced with:

除了unittest.main()，有其他的方法来运行这些测试，能够更好的控制，简化的输出以及不需要从命令行执行。例如，脚本最后的两行能被替换为：

    suite = unittest.TestLoader().loadTestsFromTestCase(TestSequenceFunctions)
    unittest.TextTestRunner(verbosity=2).run(suite)

Running the revised script from the interpreter or another script produces the following output:

从解释器或者其他脚本运行调整过的脚本生成如下的输出：

    test_choice (__main__.TestSequenceFunctions) ... ok
    test_sample (__main__.TestSequenceFunctions) ... ok
    test_shuffle (__main__.TestSequenceFunctions) ... ok

    ----------------------------------------------------------------------
    Ran 3 tests in 0.110s

    OK

The above examples show the most commonly used unittest features which are sufficient to meet many everyday testing needs. The remainder of the documentation explores the full feature set from first principles.

上面这些例子展示了最普遍使用的unittest特性，这些特性有效的满足了日常测试需求。文档剩余部分探讨了第一原则全部特性。（译者注：first principles似乎无所指代）

### 25.3.2 命令行接口 - 未完待续
