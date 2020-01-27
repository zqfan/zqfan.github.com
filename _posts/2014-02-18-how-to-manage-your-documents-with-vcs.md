---
layout: post
title: "How to Manage Your Documents With VCS"
description: ""
category: Linux
tags: [git]
---
VCS (Version Control System) is really powerful in programming, and furthermore, all the documents including design, manual, FAQ, and etc can be versioned too. This post introduces a basic solution for such purpose.

Sorry, I only provide Chinese Simplified version because this document is written for my workmate.

我们平时开发时经常要写文档，需求分析、场景分析、接口说明、流程设计、用户手册、wiki、FAQ等等，有经验的开发者把文档编写看作是软件工程中的重要一环而严肃对待。遗憾的是，我们大陆自幼浸泡在盗版xp的世界里，Word，Excel是我们平时写文档，做图表最通用的工具，而这两件利器却不是我们软件开发者最好的选择。诚然，MicroSoft Office Suite是Windows世界里少数值得尊敬的作品，但是它的目的不是教你知识，而是让你绑定在这款软件上，甚至不惜让你变傻，放弃作为自由人天然具有的改造一切的权利。

不过本文重点并不是吐槽，接下来让我们开始讨论对文档进行版本控制的必要。

### 文档版本控制对我有啥用
版本控制的定义是啥我早就忘光光了，还记得电影《三傻大闹宝莱坞》（Three Idiots）里男主对机械的定义吗（但凡节省物理劳动的皆可称为机械）？版本控制对我而言就是记录事物一切历史细节且可以任意控制它。

对文档进行版本控制有两大特点吸引我

* 精确详实的历史记录
* 任意回退与提交而不用担心丢失任何内容

如果我们是用Word，Excel的话，我们也可以在提交记录里表明这次做了哪些改动，但是却无法精细。例如接口文档里多处字段进行了修改，那么要么说明很笼统，要么我要提交多次修改，Excel就更不用说了，你会把每个单元格改了些啥写到提交记录里吗？

如果我写错了又提交了，那么我就得回退，但是我只想回退部分内容，不想让其他改动功亏一篑，Word和Excel是一个整体文件，不容许你这么做。很少见到把一个Word文档分成几个章节，每个章节单独一个Word吧。而且如果回滚提交次数多了，要记得做了哪些改动，你要付出多少呢？

### 文档版本控制的主要思想
文档其实就是字符的有逻辑的集合，和代码本质是一致的，既然代码可以进行版本控制，让我们明白无误的知道发生了什么，让我们随意操控，那么文档当然是可以的，只需要把文档转换成文本文档就可以了。

是的，纯文本文档，这个构筑Unix的基石，抛弃了所有华丽外表，只剩下赤裸的内容。它所带来的好处有很多，以下罗列几个最重要的：

* 无格式
* 通用

无格式是指文本文档永远只关心内容，至于内容如何呈现，并不是它所关心的。写过网页或者做过应用程序的开发者会明白MVC的重要性，业务逻辑、用户视图、用户交互是分开控制的。写Word的时候，你真的只在关注文档本身的内容吗，想想看是什么促使你使用Word而不是Notepad？在我看来，很多人用Word是因为，领导对格式有要求，或者希望打印后显得美观专业。（LaTex党不要偷笑了）

通用是指文本文档被几乎所有的软件支持，我可以随时随地打开浏览编辑保存或输出。这也意味着我可以用很多道工序对文本文档进行加工，最终输出的内容也许面目全非但是原始内容可以保持不变。例如我可以把文本文档转换为HTML格式，编写CSS文件使得打开HTML文件时的排版很美观；编写JavaScript，支持动态交互；将其部署到网站上供浏览评论；将HTML转换为PDF打印成册，等等。

### 文档版本控制的实现
版本控制最初主要作用于代码，将文档以纯文本形式编写后，想要得到我们日常所见到的模样，你需要一点魔法，这个魔法和编程语言类似，叫标记语言。为了得到超越Word的水准，你需要更多的努力，但是我可以保证绝对物超所值。

我们要编写一个程序，至少需要如下几个要素，具体我就不赘述了：

* 编程语言
* 编译器
* 库文件

文档也需要类似的一些要素：

* 标记语言
* 解释器
* 第三方库

标记语言的主要作用是告诉解释器，某一部分内容是区别于正文的特殊元素，例如文档标题，章节，链接，图片，表格，列表，引用等等。（这是必不可少的，但和我们在Word里点一下“标题1”把一段文字变为章节本身是一致的，都是添加了标记，但是实际对最终产生的效果不同，如果你不能理解，建议还是继续用Word吧，没人强迫你，至少我不会。）我常用的标记语言为MarkDown、reStructuredText，它们使用简洁，易于上手；功能强大，满足日常需要；用户群广，资料多，求助讨论很方便。

解释器会根据文本内容，将特殊元素根据最终输出格式进行格式化，例如，如果输出为HTML，则为标题1的添加h1标签，等等。解释器有很多，但我常用的是有瑞士军刀之称的[pandoc](http://johnmacfarlane.net/pandoc/)。它支持多种格式之间的互相转换，安装使用都很方便。

第三方库可以为你节省大量时间就获得精美的效果，不必重复造轮子，且允许你改造已有的轮子。常见的主要有tex模板，css文件等。

对于日常的文档，基本只需要一个标记语言和一个解释器就够了，输出可以根据需要再进行调整。

### 文档版本控制的例子
我常在OpenStack社区混，这里就以OpenStack的安装文档为例，提供一些链接，供大家观瞻：

* [文档源文件](https://github.com/openstack/openstack-manuals/tree/master/doc/install-guide)
* [HTML输出](http://docs.openstack.org/havana/install-guide/install/apt/content/)
* [PDF输出](http://docs.openstack.org/havana/install-guide/install/apt/openstack-install-guide-apt-havana.pdf)

以我日常的工作文档一篇为例，非常简单的例子，供大家吐槽：

* [文档源文件](https://raw.github.com/zqfan/openstack/master/ceilometer/ceilometer-configuration-reference.md)
* [HTML输出](http://zqfan.github.io/assets/doc/ceilometer-configuration-reference.html)
* [CSS辅助输出](https://raw.github.com/zqfan/openstack/master/main.css)

由于我的工作环境为Ubuntu，因此如果你工作在Windows环境下的话，这些工具链有可能无法支持这一系列动作，但是目前各开源软件社区已经加大支持力度，很多在Linux下只有控制台界面的软件在Windows下都有了GUI，请Google得到你所需要的帮助。本人恕不回答Windows下遇到的任何问题，所有Linux下遇到的问题将尽力解答。

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
