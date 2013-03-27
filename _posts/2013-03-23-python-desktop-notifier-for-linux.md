---
layout: post
title: "Python Desktop Notifier For Linux"
description: ""
category: 
tags: [python, notifier]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## Reference
* [example](http://ole.im/blog/2011/oct/20/python-notify)
* [official site](http://galago-project.org/news/index.php)

## Example

    import pynotify
    pynotify.init("example")
    n = pynotify.Notification("title","content")
    n.show()

## Gnome problem
Even i fill the content with very long string, the notifier will just show a very short text and disappear for a few seconds, but i can view the full content via notifier status bar.
 
