---
layout: post
title: "Web Service Once More"
description: ""
category: other
tags: [web service, axis]
---

# install

Firstly, `sudo apt-get install openjdk-7-jdk`, then check the version with `java -version`, the major version should be 1.7:

    java version "1.7.0_25"
    OpenJDK Runtime Environment (IcedTea 2.3.10) (7u25-2.3.10-1ubuntu0.12.04.2)
    OpenJDK Server VM (build 23.7-b01, mixed mode)

If not, for i.e., it is 1.6, then you can remove it via `sudo aptitude purge openjdk-6-jdk openjdk-6-jre openjdk-6-jre-headless`

Download packages from [Apache Axis2 Installation Guide](http://axis.apache.org/axis2/java/core/docs/installationguide.html),

    export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-i386/
    cd
    wget http://apache.fayea.com/apache-mirror//axis/axis2/java/core/1.6.2/axis2-1.6.2-bin.zip
    unzip axis2-1.6.2-bin.zip
    cd axis2-1.6.2/bin
    ./setenv.sh

You can run `echo 'export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-i386/' >> ~/.bashrc && source ~/.bashrc` to avtive JAVE_HOME by default. you can specify AXIS_HOME in the same way.

    cd
    wget http://mirrors.cnnic.cn/apache//ant/binaries/apache-ant-1.9.2-bin.zip
    unzip apache-ant-1.9.2-bin.zip

then you can build you own web service codes, put the class files under axis/repository/services then change working directory to axis/webapp

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
