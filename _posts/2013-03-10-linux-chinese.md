---
layout: post
title: "Linux Chinese"
description: ""
category: linux
tags: [linux]
---
{% include JB/setup %}
本文是个大杂烩，罗列一些Linux下遇到的中文问题，备份以供查询。

## ime

### rime

[https://code.google.com/p/rimeime/wiki/RimeWithIBus](https://code.google.com/p/rimeime/wiki/RimeWithIBus)

For Ubuntu 12.04 precise:

{% highlight sh linenos=table %}
# this repo provides libkyotocabinet, libgoogle-glog for Ubuntu 12.04;
# these packages are officially supported since Ubuntu 12.10.
sudo add-apt-repository ppa:fcitx-team/nightly

# providing libyaml-cpp0.5, librime, rime-data, ibus-rime
sudo add-apt-repository ppa:lotem/rime

sudo apt-get update
sudo apt-get install ibus-rime
ibus-daemon -d
{% endhighlight %}

Then click ibus icon and set Preference. Enter F4 to change rime setting.

## Character Encoding

* iconv
* convmv: conv file name instead of content.

## Rhythmbox Chinise Tag

reference:[http://astroman.lamost.org/dbs/archives/10536](http://astroman.lamost.org/dbs/archives/10536)

    echo "export GST_ID3_TAG_ENCODING=GBK:UTF-8:GB18030" >> ~/.bashrc
    echo "export GST_ID3V2_TAG_ENCODING=GBK:UTF-8:GB18030" >> ~/.bashrc
    source ~/.bashrc

Restart Rhythmbox and reload all files, note that just simply restart Rhythmbox will not work, you must remove fils from list(not remove from disk -_-!) and import those files.

## tex

### 微软雅黑

微软雅黑字体在编译latex文件时会把粗体字当常规字体用，跪了。注意这是个付费字体哦。我虽然解决了问题但是不知道是不是最优的办法，请酌情参考。解决办法：

* 删除已安装的微软雅黑粗体字体，在我的机器上，安装时用的是font viewer，所以安装路径是~/.fonts，直接删除msyhbd.ttf即可
* 安装fontforge，`sudo apt-get install -y fontforge`
* 在微软雅黑粗体字体上右键选择以fontforge打开
* 选择`Element`主菜单，选择`Font Info`子菜单，在弹出的对话框中选择`PS Names`选项卡（默认即是），选择`Fontname`输入栏，将默认的`MicrosoftYaHei`改为`MicrosoftYaHeiBold`，点击`OK`，在弹出的对话框中选择`OK`，在弹出的对话框中选择`Change`
* 选择`File`主菜单，选择`Generate Fonts`，在弹出的对话框中选择输出字体路径，选择字体类型为`TrueType`，关闭选项`Validate Before Saving`（因为我们只改了名字，字体文件就算有错我也不会改），点击`Save`按钮
* 进入刚才选择的输出目录，用font viewer打开，右下角选择`Install Font`，收工


这里有些链接你有兴趣可以点进去看看具体的信息

* 文献[http://www.microsoft.com/typography/otspec/name.htm](http://www.microsoft.com/typography/otspec/name.htm)
* 解决办法[http://www.tug.org/pipermail/xetex/2007-May/006564.html](http://www.tug.org/pipermail/xetex/2007-May/006564.html)

[这个链接](http://kbsd.blog.hexun.com/9860431_d.html)提供了另一种解决办法，我试过了但是不行，即使修正文中没提到的，必须把字体文件拷贝到当前目录也不行，也许你可以试试。

另外附赠中文字号与字体大小对照表：

* 七号 5.25pt 1.845mm
* 六号 7.875pt 2.768mm
* 小五号 9pt 3.163mm
* 五号 10.5pt 3.69mm
* 小四号 12pt 4.2175mm
* 四号 13.75pt 4.83mm
* 三号 15.75pt 5.53mm
* 二号 21pt 7.38mm
* 一号 27.5pt 9.48mm
* 小初号 36pt 12.65mm
* 初号 42pt 14.76mm

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

