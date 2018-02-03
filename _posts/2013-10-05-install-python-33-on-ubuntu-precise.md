---
layout: post
title: "Install Python Multiple Versions"
description: ""
category: python
tags: [py33]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Install Python3.3 on Ubuntu Precise

    curdir=`pwd`
    sudo apt-get install -y build-essential
    sudo apt-get install -y libsqlite3-dev # optional
    sudo apt-get install -y sqlite3 # optional
    sudo apt-get install -y bzip2 libbz2-dev
    cd /tmp
    wget http://python.org/ftp/python/3.3.2/Python-3.3.2.tar.bz2
    tar jxf ./Python-3.3.2.tar.bz2
    cd ./Python-3.3.2
    ./configure --prefix=/opt/python3.3
    make && sudo make altinstall # don't overshadow original interpreter
    sudo ln -s /opt/python3.3/bin/python3.3 /usr/local/bin
    cd "$curdir"

then you can run python3.3 interpreter with:

    $ python3.3

Or you could use https://github.com/saghul/pythonz instead.

# Install Python3.6 on Ubuntu 16.04 64

~~~
sudo apt-get update
# for pip ssl issue
sudo apt-get install python3-dev libffi-dev libssl-dev
wget https://www.python.org/ftp/python/3.6.4/Python-3.6.4.tgz
tar xzf Python-3.6.4.tgz
cd Python-3.6.4
./configure --prefix=/opt/python3.6
make
sudo make install
export PATH=$PATH:/opt/python3.6/bin
~~~
