---
layout: post
title: "Use Jekyll For Github Blog"
description: ""
category: github
tags: [jekyll, github-proxy, github-blog]
---
{% include JB/setup %}
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# 0 use proxy
since github is blocked by GFW, you must use proxy or vpn to access it, and i recommand *goagent*, just google it.

# 1 set proxy for git
here is a solution from [my sina blog](http://blog.sina.com.cn/s/blog_a712a4590101ggp1.html), please note that simply `export http_proxy` does not work for my case, i'm not sure the reason, and if you know, please mail to aji.zqfan@gmail.com or just leave your comment here.

    $ sudo mkdir /usr/share/ca-certificates/github.com/
    $ sudo cp /path/to/goagent/local/certs/github.com.crt /usr/share/ca-certificates/github.com/
    $  sudo dpkg-reconfigure ca-certificates
    choose prompt for new cert
    $ sudo update-ca-certificates
    $ git config --global http.proxy 127.0.0.1:8087
    NOTE: you should check your firewall for port 8087

# 2 init jekyll on github
you should create a repo on your github account, which should in the format of USERNAME.github.com, in my case, is zqfan.github.com. github will treat it as a blog and you can upload your html files even without jekyll :) but i recommand that a simple tool is better than bare hands.

    $ git clone https://github.com/plusjade/jekyll-bootstrap.git USERNAME.github.com
    $ cd USERNAME.github.com
    $ git remote set-url origin https://github.com/USERNAME/USERNAME.github.com.git
    $ git push origin master

if you receive an error, you may need run `git pull` first and then run `git push origin master`. there may be some README.md conflict, but you can ignore just as what i've done :)

# 3 install jekyll in your system

This is used for your local check, you can type http://localhost:4000 on your browser to preview your blog before push to github.

See guidelines: [http://jekyllrb.com/docs/installation/](http://jekyllrb.com/docs/installation/), [Installing Node.js via package manager](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager)

## 3.1 Ubuntu 14.04 Desktop 64 bits

~~~bash
sudo apt-get install -y ruby ruby-dev
sudo gem install -VV rubygems-update
sudo update_rubygems
sudo gem install -VV rdoc --pre
sudo gem install -VV jekyll
sudo gem install -VV rake
curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install -y nodejs
~~~

The `gem install rdoc --pre` is required when you come across:

~~~
unable to convert "\xE9" from ASCII-8BIT to UTF-8 for vendor/pygments-main/tests/examplefiles/example.cpp, skipping
undefined method `name' for #<RDoc::RubyToken::TkLPAREN:0x0000000498a3b0>
~~~

Then you can cd to your directory and run `jekyll serve`, if jekyll is running, open your browser and type `localhost:4000`, then your will see your blog.

## 3.2 Ubuntu 16.04 Server

~~~bash
sudo apt install -y ruby-full
sudo apt install -y rubygems
sudo gem update --system --verbose
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo gem install jekyll
sudo gem install bundler
sudo bundler update --verbose
sudo gem install public_suffix --version=2.0.5
sudo gem uninstall public_suffix --version=3.0.0
sudo gem install kramdown --version=1.14.0
sudo gem uninstall kramdown --version=1.15.0
sudo gem install rake
~~~

## 3.2 Other

The rest of this section is an old way to install jekyll, but not sure if it can work any more:

NOTE, you may need to run `echo 'insecure' >> ~/.curlrc` befor you do the following steps because of some ca problem which waste a lot of time of mine.

    $ curl https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash -s stable
    $ echo '[[ -s $HOME/.rvm/scripts/rvm ]] && source $HOME/.rvm/scripts/rvm' >> ~/.bashrc
    $ source ~/.bashrc
    $ rvm requirements

and run the command rvm tells you todo, particularly, install the ruby dependency packages.

    $ rvm install 2.1.0 && rvm use 2.1.0
    $ rvm rubygems latest
    $ gem install jekyll

you can now disable insecure mode of curl by delete insecure line in ~/.curlrc.

# 4 write post

    $ rake post title="Use Jekyll For Github Blog" date="2013-02-13"
    $ rake page name="about.md"
    $ rake page name="pages/about"

the last command will create ./page/about/index.html

## 4.1 customize rake post content
`rake post` will create a very basical file, but if you want add some addtional content, you can edit Rakefile in the first level directory, locate the lines:

    desc "Begin a new post in #{CONFIG['posts']}"
    task :post do

and add `post.puts` in this function, suit yourself.

## 4.2 add google analytics
set the `tracking_id` in `_config.yml` to what you get from [google analytics](https://www.google.com/analytics/), [this article](http://truongtx.me/2013/04/05/google-analytics-for-jekyll-bootstrap/) provides more detail although it is a little outdated

## 4.3 highlight
edit `_includes/themes/theme-name/default.html` and add the following lines:

    <link rel="stylesheet" href="styles/default.css">
    <script src="highlight.pack.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>

you should download highlight and put them under proper place, or you can link the files online:

{% highlight html %}
<link rel="stylesheet" href="http://yandex.st/highlightjs/7.5/styles/default.min.css">
<script src="http://yandex.st/highlightjs/7.5/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
{% endhighlight %}

note, highlight version may upgrade, so please change the href uri if you need

 [truongtx's blog](http://truongtx.me/2012/12/28/jekyll-bootstrap-syntax-highlighting/) provides more detail about highlight.

if you don't mind to add extra liquid statement which is not standard markdown syntax in your blog source file, then you can use `pygments`

{% highlight bash linenos=table %}
$ sudo apt-get install python-pygments
$ cd path/to/jekyll/project/folder
$ pygmentize -S default -f html > pygments.css
{% endhighlight %}

then add `pygments: true` in `_config.yml` to enable pygments, and add pygments.css to your default theme's default.html

{% highlight html linenos=table %}
<link rel="stylesheet" href="/pygments.css">
{% endhighlight %}

now you can use syntax highlight statement as following example, you can replace python with the real language you're using:

{% raw %}
    {% highlight python linenos=table %}
    your code is here and doesn't need indent
    {% endhighlight %}
{% endraw %}

note, linenos=table can enable copy source code without line numbers, read [jekyll guide for posts](http://jekyllrb.com/docs/posts/) and [stackoverflow answer](http://stackoverflow.com/questions/11093241/how-to-support-line-number-when-using-pygments-with-jekyll) for more details

## 4.4 disqus
Edit `_config.yml` and set `disqus_shortname` to your own instead of jekyllbootstrap.

## 4.5 trouble shoot

### 4.5.1 REXML could not parse this XML/HTML
**solution**: your post title may include `&` character, remove it
