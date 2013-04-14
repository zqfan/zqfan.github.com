---
layout: post
title: "Python Log"
description: ""
category: python
tags: [log, logging, python]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## python
[http://docs.python.org/2/howto/logging.html](http://docs.python.org/2/howto/logging.html)

here is an example:

    import logging
    format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    logging.basicConfig(filename="log",format=format)
    self._logger = logging.getLogger(self.__class__.__name__)
    self._logger.setLevel(logging.DEBUG)
    self._logger.info("initialization finished")

NOTE(aji): if you set log level via logging.basicConfig(), other module may print some logging data to your log file, i.e. requests lib's request INFO and DEBUG, currently, i don't know why.
