---
layout: post
title: 如何废弃代码
categories: Linux
description: deprecate code in popular programming languages, 如何废弃代码
keywords: deprecate code, golang, python, javascript, c++, java, php, c#, ruby, 废弃代码
---

本文列举了在多种编程语言代码中，废弃方法或属性的常见做法。

## Golang

```
// 方法说明。
//
// Deprecated: 废弃说明。
func Foo() {
}
```

## Python

```
from warnings import warn

def foo():
    warn("Reason & Solution.", DeprecationWarning, stacklevel=1)
    warn("Reason & Solution.", DeprecationWarning, stacklevel=2)

foo()
```

stacklevel 决定了打印的最后的堆栈层级，默认是1，即打印报错那一行。输出如下：

```
/data/home/zhiqiangfan/test/python/deprecate.py:4: DeprecationWarning: Reason & Solution.
  warn("Reason & Solution.", DeprecationWarning, stacklevel=1)
/data/home/zhiqiangfan/test/python/deprecate.py:7: DeprecationWarning: Reason & Solution.
  foo()
```

## Javascript

```
/**
 * @deprecated 废弃说明。
 */
```

## C++

从 `C++ 14` 开始，可以使用 `deprecated` 属性。

```
[[deprecated]]
/**
 * 方法说明
 * @deprecated 废弃说明。
 */
void foo();

[[deprecated("废弃说明。")]]
void bar();
```

`C++ 11` 需要自己定义宏解决：

```
#ifdef __GNUC__
#define DEPRECATED(func) func __attribute__((deprecated))
#elif defined(_MSC_VER)
#define DEPRECATED(func) __declspec(deprecated) func
#else
#pragma message("WARNING: You need to implement DEPRECATED for this compiler")
#define DEPRECATED(func) func
#endif

DEPRECATED(void foo()) {
}
```

## Java

使用 @Deprecated 标注即可，在注释中使用 @deprecated 也有同样的效果，区别是 Java doc 可以展示更详细的信息。

```
/**
 * @deprecated 废弃说明。
 */
@Deprecated
public void foo() {
}
```

Java 9 中新增了可选的参数用以指定更多信息。`@Deprecated(since = "4.5", forRemoval = true)`

## PHP

```
/**
 * @deprecated 废弃说明。
 */
@Deprecated
public void foo() {
}

```

## C#

使用 System 命名空间的 ObsoleteAttribute 。他接受可选的入参，第一个是字符串类型用来解释废弃的原因，第二个是布尔值类型用来决定是否触发编译错误。`[Obsolete(string message, bool error)]`

```
[Obsolete("Reason & solution.", true)]
public void foo()
```

## Ruby

`ruby` 2.3.0 标准库 `Deprecate` 官方文档：[https://ruby-doc.org/stdlib-2.3.0/libdoc/rubygems/rdoc/Gem/Deprecate.html](https://ruby-doc.org/stdlib-2.3.0/libdoc/rubygems/rdoc/Gem/Deprecate.html)。

```
class A
  extend Gem::Deprecate

  def old_method
    new_method
  end
  deprecate :old_method, :new_method, 2023, 6

  def new_method
    # new logic
  end

  attr_accessor :old_attr
  deprecate :old_attr, :none, 2023, 6
  deprecate :old_attr=, :none, 2023, 6
end

a = A.new
a.old_method
a.old_attr
a.old_attr = 1
```
`deprecate` 的四个参数都是必填的，分别为目标方法或属性，替代方法或属性，废弃时间年份，月份。如果没有可替代的，用 `:none` 替代。注意对于属性我们需要废弃读和写两个方法，关于 `attr_accessor` 可以参考 [https://www.rubyguides.com/2018/11/attr_accessor/](https://www.rubyguides.com/2018/11/attr_accessor/)。

执行代码，输出：
```
zhiqiangfan:ruby$ ruby depre.rb
NOTE: A#old_method is deprecated; use new_method instead. It will be removed on or after 2023-06-01.
A#old_method called from depre.rb:19.
NOTE: A#old_attr is deprecated with no replacement. It will be removed on or after 2023-06-01.
A#old_attr called from depre.rb:20.
NOTE: A#old_attr= is deprecated with no replacement. It will be removed on or after 2023-06-01.
A#old_attr= called from depre.rb:21.
```

[原文](https://zqfan.github.io/) 由 [zqfan (zhiqiangfan@tencent.com)](https://github.com/zqfan) 发表。版权声明（License）: (CC 4.0) BY-NC-SA
