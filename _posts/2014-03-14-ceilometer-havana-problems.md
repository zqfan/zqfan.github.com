---
layout: post
title: "Ceilometer Havana Problems"
description: ""
category: "openstack"
tags: [openstack, ceilometer, havana]
---
{% include JB/setup %}
This post records some entries for Ceilometer Havana problems and bugs. They mostly are on SLES 11 SP3 and Ubuntu 12.04.

### Ceilometer fail when boot
On SLES 11 SP3, Ceilometer 2013.2.2 will fail when boot because mongodb is not avaiable, the ceilometer-api service will die and ceilometer-collector will be dead walking. The service init script for the two service are already specify mongodb as `Should-Start`, but it seems that is not working, I don't know why.

There is a workaround which adds `sleep 5` statement before **/sbin/startproc -s -u $USER -t ${STARTUP_TIMEOUT:-5} -q /usr/bin/ceilometer-$DAEMON --config-file=$CONFFILE --logfile=$LOGFILE** both in /etc/init.d/openstack-ceilometer-api and /etc/init.d/openstack-ceilometer-collector, this is intent to delay service start to wait mongodb available.

Ceilometer 2013.2.3 on SLES 11 sp3 seems already fix this problem but I don't know how.

### agent-central fail when keystone is not available
ceilometer-agent-central uses oslo.loopingcall, which will catch `Exception` raiseed by registed interval task and stop calling it. There is a chance when ceilometer-agent-central do its periodical task while keystone service is not available, then the ceilometer.agent.central.AgentManager.interval_task will fail to create keystoneclient object, which will raise an exception to upper caller. In such scenario, the periodical poll task will be stopped, while the ceilometer-agent-central process is still running.

The workaround (actually it is a bug fix) is simple: catch that exception (or `Exception`) and just return directly, which means skip this particular period of poll task.

### ceilometer resource-list fail when samples too lot
The ceilometer 2013.2.2 will do a mongo aggregate for resource, When there is a huge amount of samples, it will extremly slow and use a lot of memory. It has been changed to map-reduce recently, both in master and havana branch, see [https://bugs.launchpad.net/ceilometer/+bug/1262571](https://bugs.launchpad.net/ceilometer/+bug/1262571). But if you meet such problem: **failed: exception: Sort exceeded memory limit of 104857600 bytes, but did not opt-in to external sorting. Aborting operation**, then maybe it hit this problem.

The mongodb has a limitation for aggregation, which is 10% physical memory in mongo 2.4 and 100MB memory in mongo 2.5, see [http://docs.mongodb.org/master//reference/limits/#Aggregation%20Pipeline%20Operation](http://docs.mongodb.org/master//reference/limits/#Aggregation%20Pipeline%20Operation). The official manual says this limitation can be avoided by set `allowDiskUsage` to true, but I cannot verify that since I'm using version 2.4.6.

### alarm-notifier and alarm-evaluator kill each other
Ceilometer 2013.2.2 on SLES 11 SP3, ceilometer-alarm-notifier and ceilometer-alarm-evaluator cannot be running in the same time, if you're using the service {start,stop,restart} command. That it is because the service init script uses {start,kill,check}proc command, which identify the service by their process basename, that should be fine, but in Linux process system, the process name will be truncated to 16 characters, so ceilometer-alarm-{evaluator,notifier} will be treated as same process, so does ceilometer-agent-{central,compute}!

Ceilometer 2013.2.3 on SLES 11 sp3 has fixed this problem by add --pidfile option to {start,kill,check}proc command, you can learn example from it if you're not willing to update your system. Note, the pidfile should be under /var/run/, which means hold by root user.

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
