---
layout: post
title: "using local pip source"
description: ""
category: Linux
tags: []
---
If https://pypi.python.org/simple is slow or forbidden, you can use mirrors, if mirror is down or forbidden, then you can setup a local source. This post provides an example on Ubuntu Precise.

Firstly, you need a web server, apache is a good choice but not the only one.

~~~
# apt-get install apache2
# mkdir /var/www/pypi
# cd /var/www/pypi
# service apache2 restart
~~~

Install pip and upgrade it, you can download python packages via wget from specific url, but it is hard to locate each package's location, pip is a good choice. If you're completely blocked with internet, you can download all packages in your mobile hard disk and copy them to your server.

~~~
# apt-get install python-pip
# pip install --upgrade pip
~~~

then download the packages, for example, oslo.config

~~~
# pip -v install --no-install -d /var/www/pypi/ oslo.config
~~~

Now, you can download your packages from your own server, for example, in another host

~~~
# pip install --no-index --find-links http://your-server-ip/pypi oslo.config
~~~

An advanced tip is that, you can write all your packages' name in a requires.txt, then use a script to download them all, note that, `pip install --no-install --download=/var/www/pypi --ignore-installed -r requires.txt` will stop to work if one of the listed package is fail to download, so a better choice may be downloading them one by one. Since pip needs interactive when it finds there is existent files in the download directory, which will block the script to automatically run, so you may need to run `apt-get install expect` which enables the amazing expect command to run the script.

~~~
# pwd
/var/www/pypi
# cat down-them-all.sh
#! /usr/bin/sh

for package in `cat requires.txt`;
do
expect <<EOF
set timeout 120
spawn pip -v install --no-install -d /var/www/pypi $package
expect {
"(i)gnore, (w)ipe, (b)ackup " { send "i\r" }
}
EOF
done
~~~

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
