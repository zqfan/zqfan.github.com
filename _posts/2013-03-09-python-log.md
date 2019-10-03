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

```
import logging
import logging.handlers

FMT = '%(asctime)s %(process)d %(filename)s L%(lineno)s %(levelname)s %(message)s'
gb = 1024 * 1024 * 1024
handler = logging.handlers.RotatingFileHandler("example.log", maxBytes=gb, backupCount=10)
handler.setFormatter(logging.Formatter(FMT))
log = logging.getLogger(__name__)
log.setLevel(logging.INFO)
log.addHandler(handler)
# not required, only for nice console output
try:
    import coloredlogs
    coloredlogs.install(level='INFO', logger=log, fmt=FMT)
except Exception as e:
    log.info("coloredlogs is not found, using default log: %s", e)
```

NOTE(aji): if you set log level via logging.basicConfig(), other module may print some logging data to your log file, i.e. requests.
