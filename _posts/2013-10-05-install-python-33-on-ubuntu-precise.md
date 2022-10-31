---
layout: post
title: "Install Python Multiple Versions"
description: ""
category: Python
tags: [py33]
---

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

# Change default Python version on CentOS

`alternatives --config python` will be done.

```
# alternatives --config python 

There are 3 programs which provide 'python'.

  Selection    Command
-----------------------------------------------
*  1           /usr/libexec/no-python
   2           /usr/bin/python2
 + 3           /usr/bin/python3

Enter to keep the current selection[+], or type selection number: 2
# python
Python 2.7.18 (default, Oct  9 2022, 20:43:49) 
[GCC 8.5.0 20210514 (Red Hat 8.5.0-10)] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> 
```

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
