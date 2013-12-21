---
layout: post
title: "Design Pattern"
description: ""
category: other
tags: [design pattern]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

1. 针对接口编程，而不是对实现编程

2. 优先使用对象组合，而不是类继承

## 23 patterns
### Abstract Factory
提供一个创建一系列相关或相互依赖对象的接口,而无需指定它们具体的类。

![结构](/resources/design-pattern-abstract-factory.png)
看起来就是个抽象类
### Builder
将一个复杂对象的构建与它的表示分离,使得同样的构建过程可以创建不同的表示。

![结构](/resources/design-pattern-builder.png)
### Factory Method
定义一个用于创建对象的接口,让子类决定实例化哪一个类。 Factory Method使一个类的
实例化延迟到其子类。

![结构](/resources/design-pattern-factory-method.png)
### Prototype
用原型实例指定创建对象的种类,并且通过拷贝这些原型创建新的对象。

![结构](/resources/design-pattern-prototype.png)
