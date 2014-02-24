---
layout: post
title: "Simple Example of Pandoc MarkDown"
description: ""
category: "linux"
tags: [markdown, pandoc]
---
{% include JB/setup %}
MarkDown is an excellent mark up language, and Pandoc is famous as swiss-army knife in file format convertion field. This post introduces the basic usage of Pandoc with MarkDown extensions, which can be used for software document generation.

Sorry, this post only provides Chinese Simplified version since it is written for my workmate.

我前面的短文阐述了对文档进行版本控制的意义，并且举了OpenStack和我自己的工作为例字，本篇短文从具体实施的角度描述，我是如何将Word文档转换为MarkDown文件，并如何再转换为HTML文件。事实上，Pandoc还可以再把MarkDown转换为Word，不过这不是本文所关注的。

OpenStack使用DocBook生成官方文档，使用reStructuredText生成开发者文档，由于本人一开始接触的就是MarkDown并以此搭建了自己的博客，又同意MarkDown作者“无招胜有招”的理念，所以就一直用下来了。本文介绍的也是Pandoc结合MarkDown扩展生成较为复杂的HTML元素，不过Pandoc也支持reStructuredText格式，有兴趣的可以研究下。

    A Markdown-formatted document should be publishable as-is, as plain text, without looking like it’s been marked up with tags or formatting instructions. – John Gruber

Pandoc MarkDown扩展破坏了MarkDown本身极简化的思想，是出于排版的需要，同时它也支持严格MarkDown语法（关闭所有扩展）。由于例子中目标格式中的表格无法用MarkDown标准语法实现，所以只好使用扩展。但是从例子中你可以看到，扩展的用法本身也是非常简单的，因为它们基本都继承了MarkDown思想的另一个表现：lazy form，对标记本身有很松弛的要求，但也导致需要借助其他工具辅助排版，例如CSS文件或模板文件等。想要生成印刷书籍级别的编码狂人可以选择投奔Donald Knuth爷爷开发的Tex软件。

本文一切基于Pandoc MarkDown扩展，不讨论标准与扩展的差异。本文只介绍基本用法，高级用法有很多，查看用户手册以得到你想要的。

先看例子 [OpenStack Ceilometer Havana API V2](http://zqfan.github.io/assets/doc/ceilometer-havana-api-v2.html)，它的原文件托管在[github.com/zqfan/openstack](https://raw.github.com/zqfan/openstack/master/ceilometer/ceilometer-havana-api-v2.md)

我基本是照着[Pandoc的用户手册](http://johnmacfarlane.net/pandoc/README.html)写完的，此外，如果你想要尝试的话，你还需要阅读[MarkDown标准语法](http://daringfireball.net/projects/markdown/syntax)，如果觉得John Gruber的CSS让你无法忍受，你可以看[这里](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)或者自己Google。

### Q：如何定位文档名？
在文档头部定义，第一行为文档名称，第二行为作者列表，第三行为时间，没有则留空，详见手册。
```
% OpenStack Ceilometer Havana API V2
%
%
```

### Q：标题如何定义
在空行后（如果是文档首行则不需要空行）以`#`开始，有几个`#`就代表几级标题
```
# 一级标题

## 二级标题

###### 六级标题
```

### Q：如何给标题编号
不需要编号，Pandoc在生成目标文件时有参数或者模板指定，会自动编号，以html为例
```
pandoc --number-sections -o target.html source.md
```
如果某个标题你不想编号，在标题后增加控制符` {-}`或者` {.unnumbered}`即可

### Q：如何给标题指定id
给标题指定id有利于在html文档中快速定位章节，你可以自己指定一个有意义的名称
```
# 前言 {#perface}
```
当没有手动指定时，会按照一定规则自动指定id。

### Q：如何写一段话
段落以空行区分，单纯的换行符会被忽略，你也可以使用跳脱符`\`强制换行，一般不需要这么做
```
这是第一段，
只会显示一行

这是第二段
```
效果：

这是第一段，
只会显示一行

这是第二段

### Q：如何编辑列表
列表分有序列表和无序列表两种，出于很多特殊需要会有些特殊用法，这里举两个简单的例子
```
1. 这是有序列表
1. 会自动编号

* 这是无序列表
* 没有编号
```
效果：
1. 这是有序列表
1. 会自动编号

* 这是无序列表
* 没有编号

### Q：如何指定超链接
超链接分文档内部链接，和外链，这里以常用的外链为例
```
[这是个链接，指向Google首页](http://www.google.com)
```
效果：[这是个链接，指向Google首页](http://www.google.com)

### Q：如何指定图片链接
由于MarkDown无法自己编辑图片，因此只能以外链的形式给出，比普通链接多了个前导`!`
```
![亲们，福利来了！！！！](http://www.toux8.com/uploads/allimg/110916/1_110916201419_7.jpg)
```
效果：

![亲们，福利来了！！！！](http://www.toux8.com/uploads/allimg/110916/1_110916201419_7.jpg)

### Q：如何格式化文本
这个有很多，这里以常见的加粗，斜体为例
```
**加粗**，*斜体*
```
效果：**加粗**，*斜体*

### Q：如何引用原文
引用原文可以用缩进或者代码块的方式来呈现，代码块由成对的三个连续的`` ` ``包裹，各占单独一行

````

    前导空行后，每行缩进四格，最后以空行结束即可

```
这个效果也是一样的
```
````
效果：

    前导空行后，每行缩进四格，最后以空行结束即可

```
这个效果也是一样的
```

### Q：如何对代码进行语法高亮
指定语言即可，以python为例
````
```python
>>> import girlfriend
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named girlfriend
>>>
```
````
效果：
{% highlight python %}
>>> import girlfriend
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ImportError: No module named girlfriend
>>>
{% endhighlight %}

### Q：如何指定表格
这个比较复杂，但是并不难掌握，表格分多种，这里介绍常用的三种。

普通表格，即标准语法规定的表格，以空行开始
```

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:---------|-------:|
| 1 | 2 |3
```
效果（无css）：

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:---------|-------:|
| 1 | 2 |3

多行表格，单元格支持换行，这是扩展功能，github不支持这个扩展，所以你无法在这篇文章里看到效果，请在示例中查看效果。
换行时需要输入跳脱符`\`强制换行，表格有多行时，行与行之间要有一个空行。
(注意由于github使用的是非等宽字体导致你看到的内容排版错乱，表格的内容和格式化符号事实上是对齐的）
```
---------------------------------------
 提问                  回答
---------------------- ----------------
 码农的生活是什么样的  1、写代码\
                       2、写代码的文档
---------------------------------------
```

网格表格，单元格支持代码块，注意，格式上我没有采取扩展的正常语法，那需要根据代码的列数进行很枯燥的格式化，而是用了lazy form，非常简便
````
+-+
| 其实真的有girlfriend这个模块，不过后来被移除了
+=+
| ```python
| >>> import girlfriend
| >>> girlfriend.love
| Traceback (most recent call last):
|   File "stdin", line 1, in module
| AttributeError: 'module' object has no attribute 'love'
| >>>
| ```
+-+
````

### Q：为什么转换为html后这么丑，表格连个边框都没有
使用css进行格式化即可，例如示例采用的是[huawei.css](https://github.com/zqfan/openstack/blob/master/ceilometer/huawei.css)

### Q：示例中的Disqus是怎么来的
示例中的Disqus是采用内嵌的第三方Disqus Javascript插件完成的，你也可以加入第三方Google Analytics Javascript监视页面的访问。查看[示例采用的js代码](https://raw.github.com/zqfan/openstack/master/jekyll.md)

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
