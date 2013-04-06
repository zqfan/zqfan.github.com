---
layout: post
title: "Use Jekyll For Github Blog"
description: ""
category: Github
tags: [jekyll, github-proxy, github-blog]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# use proxy
since github is blocked by GFW, you must use proxy or vpn to access it, and i recommand *goagent*, just google it.

# set proxy for git
here is a solution from [my sina blog](http://blog.sina.com.cn/s/blog_a712a4590101ggp1.html), please note that simply `export http_proxy` does not work for my case, i'm not sure the reason, and if you know, please mail to aji.zqfan@gmail.com or just leave your comment here.

    $ sudo mkdir /usr/share/ca-certificates/github.com/
    $ sudo cp /path/to/goagent/local/certs/github.com.crt /usr/share/ca-certificates/github.com/
    $  sudo dpkg-reconfigure ca-certificates
    choose prompt for new cert
    $ sudo update-ca-certificates
    $ git config --global http.proxy 127.0.0.1:8087
    NOTE: you should check your firewall for port 8087

# init jekyll on github
you should create a repo on your github account, which should in the format of USERNAME.github.com, in my case, is zqfan.github.com. github will treat it as a blog and you can upload your html files even without jekyll :) but i recommand that a simple tool is better than bare hands.

    $ git clone https://github.com/plusjade/jekyll-bootstrap.git USERNAME.github.com
    $ cd USERNAME.github.com
    $ git remote set-url origin https://github.com/USERNAME/USERNAME.github.com.git
    $ git push origin master

if you receive an error, you may need run `git pull` first and then run `git push origin master`. there may be some README.md conflict, but you can ignore just as what i've done :)

# install jekyll in your system
this is used for your local check, you can type http://localhost:4000 on your browser to preview your blog before push to github.
NOTE, you may need to run `echo 'insecure' >> ~/.curlrc` befor you do the following steps because of some ca problem which waste a lot of time of mine.

    $ curl https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash -s stable
    $ echo '[[ -s $HOME/.rvm/scripts/rvm ]] && source $HOME/.rvm/scripts/rvm' >> ~/.bashrc
    $ source ~/.bashrc
    $ rvm requirements

and run the command rvm tells you todo, particularly, install the ruby dependency packages.

    $ rvm install 1.9.2 && rvm use 1.9.2
    $ rvm rubygems latest
    $ gem install jekyll

you can now disable insecure mode of curl by delete insecure line in ~/.curlrc.

    $ cd USERNAME.github.com
    $ jekyll --server

if jekyll is running, open your browser and type `localhost:4000` your will see your blog :)

# write post

    $ rake post title="Use Jekyll For Github Blog" date="2013-02-13"
    $ rake page name="about.md"
    $ rake page name="pages/about"

the last command will create ./page/about/index.html

## customize rake post content
`rake post` will create a very basical file, but if you want add some addtional content, you can edit Rakefile in the first level directory, locate the lines:

    desc "Begin a new post in #{CONFIG['posts']}"
    task :post do

and add `post.puts` in this function, suit yourself.
