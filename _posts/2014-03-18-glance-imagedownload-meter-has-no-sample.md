---
layout: post
title: "Glance image.download Meter Has No Sample"
description: ""
category: "openstack"
tags: [openstack, glance, ceilometer]
---
{% include JB/setup %}
Ceilometer listens on notifications topic of rabbitmq by default, if glance sets its rabbit_notification_topic to something else, the ceilometer-collector will not able to consume the message, which leads to no sample data will be found for image operations. This post records how I find this issue.

One of my workmate complains that no image operation is monitored in his openstack havana environment, so i log into his environment and do some test:

~~~ bash
# glance index
ID                                   Name        Disk Format  Container Format  Size
------------------------------------ ----------- ------------ ----------------- ---------
bb0f5a84-4eab-47fc-a862-f21662737b4a img_cirros  qcow2        bare              13147648
# glance image-download --file /dev/null img_cirros
# ceilometer meter-list | grep image.download
~~~

There is no image.download sample at all, but i find that the image and image.size samples are polled by ceilometer-agent-central. I know the image.download, image.server, image.update, image.delete and image.upload (all image operations) are handlerd directly by ceilometer-collector, so if the image.download is not metered, the problem may lay between ceilometer-collector to glance-api.

firstly, i checked the rabbitmq service with:

~~~ bash
# rabbitmqctl list_queues name messages consumers
...
glance_notifications.error  0   0
glance_notifications.info   1   0
glance_notifications.warn   0   0
...
notifications.info  0   29
~~~

so the glance does send notifications after image-download is done, but there is no consumers, actually, the message should be sent to notifications.info instead of glance_notifications.info, so the collector cannot receive the message, and image.download meter has no sample.

so i checked the /etc/glance/glance-api.conf:DEFAULT.rabbit_notification_topic, and find it is glance_notifications, after i reset it to notifications, then restart the glance-api service, and test it with:

~~~ bash
# glance image-download --file /dev/null img_cirros
# ceilometer meter-list | grep image.download
| image.download | delta | B | bb0f5a84-4eab-47fc-a862-f21662737b4a | None | da80956c3c5b41b6b85bd6cfca76b1fb |
~~~

the image operations are monitored again.

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
