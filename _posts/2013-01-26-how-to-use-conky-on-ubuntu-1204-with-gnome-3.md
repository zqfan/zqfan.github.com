---
layout: post
title: "Conky On Ubuntu 12.04 With Gnome 3"
description: ""
category: linux
tags: [conky]
---
{% include JB/setup %}
## License
this file is published under [CC BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## step 1:
apt-get install conky

## step 2:
disable file manager on desktop, you can disable it by advanced system setting tool provided by gome-tweak-tool. if you don't do this, conky will disappear whenever you click or right click the desktop : (

## step 3:
i use a theme based on another theme which named Gold&grey from SuNjACk94, and modify a lot, you can modify it to meet yourself.

note that, since www.weather.com no longer support XOAP service, all the toturials of ConkyForecast are not working, so you can use wundergroud's rss service by following this: http://pyther.net/2011/10/weather-underground-script/, or you can use service of www.weather.com.cn,  by add the following python script to you bin directory or one of your $PATH dir, in my case, ~/bin is a search directory of $PATH, so put the weather file to the bin dir then

    # chmod u+x weather

since i don't know how to make a link on sina blog, (WTF?),  then you can use the following command to create it, or you can simply copy it without the cat command:

## step 4:
install the following fonts: Impact, Poky, PizzaDude Bullets, StyleBats. all these fonts are free and can be downloaded from google. after download, double click it and choose "install font".

## step 5:

    # killall conky
    # conky

you can add conky to your boot service, but personally, i don't want to do that

enjoy it : )
