---
layout: post
title: "Python Log"
description: ""
category: python
tags: [log, logging, python]
---
{% include JB/setup %}
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## python
[http://docs.python.org/2/howto/logging.html](http://docs.python.org/2/howto/logging.html)

here is an example:

    import logging
    format = "%(asctime)s - %(name)s[%(process)d][%(thread)d] - %(levelname)s - %(message)s"
    logging.basicConfig(level=logging.INFO, filename="log", format=format)
    log = logging.getLogger(__name__)
    try:
        import coloredlogs
        FMT = '%(asctime)s %(name)s[%(process)d] %(levelname)s %(message)s'
        coloredlogs.install(level='INFO', logger=log, fmt=FMT)
    except Exception as e:
        log.info("coloredlogs is not found, using default log: %s", e)

NOTE(aji): if you set log level via logging.basicConfig(), other module may print some logging data to your log file, i.e. requests lib's request INFO and DEBUG, currently, i don't know why.
