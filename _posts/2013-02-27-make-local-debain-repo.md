---
layout: post
title: "Make Local Debain Repo"
description: ""
category: linux
tags: [apt-mirror, dpkg-scanpackages]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## using apt-mirror
### reference:
1: http://ubuntuforums.org/archive/index.php/t-1512787.html

### install packages

    # aptitude install apt-mirror apache2

### config apt-mirror

    # cat /etc/apt/mirror.list
    set base_path    /home/vrv/spool/apt-mirror
    set nthreads     2
    set _tilde 0

    deb-amd64 http://mirrors.163.com/ubuntu/ precise main universe restricted multiverse
    deb-amd64 http://mirrors.163.com/ubuntu/ precise-security universe main multiverse restricted
    deb-amd64 http://mirrors.163.com/ubuntu/ precise-updates universe main multiverse restricted
    deb-i386 http://mirrors.163.com/ubuntu/ precise main universe restricted multiverse
    deb-i386 http://mirrors.163.com/ubuntu/ precise-security universe main multiverse restricted
    deb-i386 http://mirrors.163.com/ubuntu/ precise-updates universe main multiverse restricted
    deb-src http://mirrors.163.com/ubuntu/ precise main universe restricted multiverse
    deb-src http://mirrors.163.com/ubuntu/ precise-security universe main multiverse restricted
    deb-src http://mirrors.163.com/ubuntu/ precise-updates universe main multiverse restricted

    clean http://archive.ubuntu.com/ubuntu

note: 
1. base_path is the files where to be stored, default is /var/spool/apt-mirror, you can set it to anywhere you want, just be sure it has more than 100G free disk space since all the files list in above config need 90G disk space
2. nthreads is the number of wget thread, 20 seems no good for practice
3. deb-i386 means to download 32bit deb packages

### copy the mirror

    # apt-mirror

in this case, all files will be downloaded to $base_path/mirror/mirrors.163.com/ubuntu

### config apache2
ubuntu source server is a http server, since apache2 is good for static files, i choose it to hold ubuntu source service

    # cd /var/www
    # ln /home/vrv/spool/apt-mirror/mirror/mirrors.163.com/ubuntu -s

### sync with source mirror

    # vim /etc/cron.d/apt-mirror
    
remove the leading #
    
    0 4 * * * apt-mirror /usr/bin/apt-mirror > /var/spool/apt-mirror/var/cron.log

### use local mirror
edit your /etc/apt/sources.list, make the local source list before other to ensure fit first, the run apt-get update, enjoy yourself.

## using dpkg-scanpackages
if you don't want to install packages from source code via make install, or your program just use apt to install packages and you don't want change it. However, you are offline and only have the packages downloaded, in this wired situation, you can use dpkg-scanpackages to make a local file system package source.

    # sudo apt-get install dpkg-dev gzip

Generally, your packages downloaded via apt will store in /var/cache/apt/archives, so run the following command:

    # sudo cd /var/cache/apt
    # sudo dpkg-scanpackages archives /dev/null | gzip > archives/Packages.gz
    # sudo mv /etc/apt/sources.list /etc/apt/sources.list.mybak
    # sudo echo "deb file:/var/cache/apt/ archives/" > /etc/apt/sources.list
    # sudo apt-get update

your directory can be different from archives, specifically, can be anywhere, then run `dpkg-scanpackages debs/ /dev/null | gzip > debs/Packages.gz`

Since the packages fingerprint has been changed, you will receive authentication prompt when you install packages, or you can use --force-yes option to avoid this.

NOTE(aji): there is something wired of the postfix "/" of dir, and currently, i just could not remember which is necessary, i will confirm when i try next time.

NOTE(aji): the file Packages.gz is hardcode, and must put under archives directory.
