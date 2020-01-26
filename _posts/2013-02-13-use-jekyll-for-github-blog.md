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

### 3.2.1 Current Way

#### 3.2.1.1 Install Ruby>=2.4.0

* [https://www.ruby-lang.org/en/documentation/installation/](https://www.ruby-lang.org/en/documentation/installation/)
* [http://rvm.io/](http://rvm.io/)

```
sudo apt-get update
sudo apt-get remove ruby*
gpg2 --keyserver-options http-proxy=http://PROXY_HOST:PROXY_PORT --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable --ruby
ruby -v
gem -v
```

If your are behind a proxy, you need to specify the proxy for gpg2: [https://unix.stackexchange.com/questions/361213/unable-to-add-gpg-key-with-apt-key-behind-a-proxy](https://unix.stackexchange.com/questions/361213/unable-to-add-gpg-key-with-apt-key-behind-a-proxy)

#### 3.2.1.2 Install Jekyll

~~~bash
sudo apt-get install build-essential zlib1g-dev
gem install jekyll bundler
~~~

Ruby has been installed, the guide in [https://jekyllrb.com/docs/installation/ubuntu/](https://jekyllrb.com/docs/installation/ubuntu/) is conflict with rvm, no need to run `sudo apt-get install ruby-full`.

`bundle exec jekyll serve` might fail with message:

```
Could not find concurrent-ruby-1.0.5 in any of the sources
Run `bundle install` to install missing gems.
```

However, `~/.bundle` directory is created by `root` account, hence you need to run `sudo chown zqfan:zqfan /home/zqfan/.bundle/ -R` to change the owner to yourself, and then run `bundle install`.

### 3.2.2 Old ways

~~~bash
sudo apt-get install --yes jekyll
sudo apt-get install --yes zlib1g-dev
sudo gem install --verbose github-pages
~~~

if it doesn't work, try the following steps

please note that if you are behind a proxy, you will need to use --http-proxy for `gem install` and `gem update`.
or you can use `sudo visudo` command and add `http_proxy https_proxy` to env_keep variable.

~~~bash
sudo apt install --yes ruby-full
sudo gem update --system --verbose
# this line fix a warning in previous command
sudo gem pristine --verbose rake
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install --yes nodejs
# this line is required by next command when build ffi lib
sudo apt-get install --yes build-essential
sudo gem install --verbose jekyll
sudo apt-get install --yes zlib1g-dev
sudo gem install --verbose github-pages
# fix version conflict
sudo gem uninstall --verbose public_suffix --version=3.0.0
sudo gem install --verbose public_suffix --version=2.0.5
sudo gem uninstall --verbose listen --version=3.0.8
sudo gem install --verbose listen --version=3.0.6
sudo gem uninstall --verbose kramdown --version=1.15.0
sudo gem install --verbose kramdown --version=1.14.0
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
