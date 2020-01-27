---
layout: post
title: "VOA Downloader"
description: ""
category: JAVA
tags: [ova, java]
---

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# References
1. [抓取网页内容](http://www.zhuoda.org/lunzi/90049.html)
2. [多线程下载](http://www.open-open.com/lib/view/open1330474721046.html)
3. [后台运行](http://www.leeziwong.com/?p=56)
4. [log4j guide](http://www.iteye.com/topic/378077)

# key point:

Q: background run
start /b java xxx
then you can run the program in the background

Q: ignore files already download
java.io.File.exists()

# update-log:

## 2012-07-12
* now we can print the content of http://www.51voa.com/ on screen
* now we can print the line contains list
* now we can print the url of all relatest list
* now we can specify a date to get list on that day
* now we can ignore Bilingual News
* bug fixed: some li element just contain 4 a elements, which means this list does not contain a translation
* now we can download all the mp3 of current day

## 2012-07-13
* now we can ignore mp3 which have already download
* now we can print info to a log file

## 2012-07-20
* now we can specify start date to download mp3 files between start date and end date

## 2012-07-22
bug fixed:

before: if there is no specified start date, program will list releatest as null

after: program will use end date as start date
