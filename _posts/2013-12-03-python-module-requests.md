---
layout: post
title: "Python module: requests"
description: ""
category: python
tags: [requests]
---

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## sslerror
behavior: requests.exceptions.SSLError:\[Errno 1\] \_ssl.c:504: error:14090086:SSL routines:SSL3\_GET\_SERVER\_CERTIFICATE:certificate verify failed

solutions:

1. requests.get('https://somehost.com', verify=False), [ref: Python Requests throwing up SSLError](http://stackoverflow.com/questions/10667960/python-requests-throwing-up-sslerror)
2. use browser's ca file, [ref: How to find the path to a SSL cert file](http://www.rqna.net/qna/pmqvmp-how-to-find-the-path-to-a-ssl-cert-file.html)

## disable logging

    import logging
    requests_log = logging.getLogger("requests")
    requests_log.setLevel(logging.WARNING)

here we directly modify the requests logging level, which is not so simple. [ref: How do I disable log messages from the Requests library?](http://stackoverflow.com/questions/11029717/how-do-i-disable-log-messages-from-the-requests-library)

## disable redirect
if the page set redirect, requests will auto get the new location, which may not be what you expected, you can simply set allow_redirects=False to disable it.
