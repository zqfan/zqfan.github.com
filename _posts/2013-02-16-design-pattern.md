---
layout: post
title: "Design Pattern"
description: ""
category: other
tags: [design pattern]
---
我也不知道为什么有这个博文，看起来好水，那么，继续水一下吧。这些图片忘了从哪儿裁（chao）剪（xi）的了，没法子更新了，抱歉。

1. 针对接口编程，而不是对实现编程
1. 优先使用对象组合，而不是类继承

# 23 patterns

## 构造型模式

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

## 责任型模式

### 单例模式
确保某个类只有一个实例，并提供一个全局访问点。

{% highlight java %}
public class Demo {
    private static Demo instance = null;

    // 同步锁是必要的
    synchronized public static Demo getInstance() {
        if (null == instance) {
            instance = new Demo();
        }
        return instance;
    }

    // 私有是必要的
    private Demo() {
    }

    public void greeting() {
        System.out.println("Greetings, stranger!");
    }

    public static void main(String [] args) {
        Demo instance = Demo.getInstance();
        instance.greeting();
    }
}
{% endhighlight %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
