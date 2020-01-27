---
layout: post
title: "Python Log"
description: ""
category: Python
tags: [log, logging, python]
---
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

python official doc: [http://docs.python.org/2/howto/logging.html](http://docs.python.org/2/howto/logging.html)

Instead of printing message on console, log to disk file and analyse it after problem occurs is a better way.
If you are implementing a backgroud service, or a GUI application, or anything you cannot monitor the console, `print` should not be used.

There are five levels for logging information.

* DEBUG: log detailed message, for diagnostic purpose.
* INFO: brief message to confirm program is working as expected.
* WARNING: the default level, program is fine but something unexpected happend, you should look into it.
* ERROR: program does not work as expected for some functionality, but it still perform the rest of them.
* CRITICAL: program cannot work anymore and must quit immediately.

DEBUG and INFO are usually used when you're developing your code and test it locally. After your code is online, only WARNING and higher level message are needed to log.
But you can still adjust it according to your need.

A useful message should contain at least the following information.

* When: the time this message is send, better if it is accurate to milliseconds.
* Where: which process (or even thread), which file and its line number (sometimes the function name).
* What: the problem itself.
* Severity: how bad the problem is, refer to the five levels above.
* Why: optional, why the problem occurs, such as insufficient requirement, db account error, if the program can tell.
* How: optional, what the user should do to fix the problem, if the program can tell.

Always consider the resource limit, since now you're deploying your code in a real machine, additional to CPU & memory usage, you should consider how much disk space your log files can be used, and set the upper limit to your log files.
By default, there is no limit in log itself, you can use [logrotate](https://github.com/logrotate/logrotate) service, or use the feature provided in python logging.
Remember, if your code is performing a very busy (even just potentially) service, RotatingFileHandler is better than TimeRotatingFileHandler, because splitting log files by day is not safe to constraint the disk space limit, all disk space might be consumed by a single file.

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

If you want to print message in console nicely for the same time, consider to use coloredlogs.

```
...

try:
    import coloredlogs
    coloredlogs.install(level='INFO', logger=log, fmt=FMT)
except Exception as e:
    log.info("coloredlogs is not found, using default log: %s", e)
```
