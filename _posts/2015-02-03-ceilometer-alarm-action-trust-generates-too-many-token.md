---
layout: post
title: "Ceilometer Alarm Action Trust Generates Too Many Token"
description: ""
category: "openstack"
tags: []
---
{% include JB/setup %}
Ceilometer supports posting http requests when alarm is triggered. If requests listener is deployed outside system boundary, it may require https connection and identify post request invoker. Ceilometer trust+https notifier can satisfy such need, but current implementation has performance issue in large scale system, which leading to Keystone crash.

Started by Heat use cases, trust+https notifier is the only way to provide identify information for alarms. trust, for a simple explanation, is user A specifies user B has some roles in project P. User A should create trust for user B before B creates token using trust id. Here is an article written by Michael McCune from RedHat, [Delegating Keystone trusts through the ReST API][1]

The implementation of trust for alarm notify during Juno development cycle: [trust.py](https://github.com/openstack/ceilometer/blob/stable/juno/ceilometer/alarm/notifier/trust.py). Note the [line 44](https://github.com/openstack/ceilometer/blob/e8380ba90f29189ffbcee35c8a069b4882a98a99/ceilometer/alarm/notifier/trust.py#L44) will create a new keystone client object before an alarm is posted. In a large scale environment, which may have one million alarms and some of them may enable repeat actions, suppose 1% of them are triggered during alarm evaluation, then, there would be ten thousands new tokens are created, in 24 hours, is more than 14 millions. For worst case, all alarms enable repeat action, there will more than one billion tokens!

If we can reuse tokens, for the assumed scenarios, there will only one million tokens, which is only 10% of current amount. And for the worst case, it doesn't create more. The way to reuse tokens is caching keystone client object for each trust id, here we assume each user/tenant has limited number of trust id, so trust id will
be around ten thousands count.

In large scale deployment, there will be several ceilometer-alarm-notifier, but they will consume uncertain alarm notifications, so finally, they will notify all alarms from a long time perspective. Then the question is: how large would the cache be if there is a ten thousands of keystone client object in memory?

Here is the test code:

{% highlight python linenos=table %}
from keystoneclient.v3 import client

l = []
maxsize = raw_input("maxsize: ")
for i in range(int(maxsize)):
    print i / float(maxsize)
    l.append(client.Client(auth_url="http://127.0.0.1:5000/v3", username="ceilometer", password="admin"))

raw_input("finish")
{% endhighlight %}

Then I use `ps aux` to get the memory usage, for maxsize == 0, it is:

~~~
# ps aux | grep test.py | grep -v grep
root      75021  0.8  0.5  76996 20216 pts/41   S+   22:00   0:00 python test.py
~~~

for maxsize == 1000, it is:

~~~
# ps aux | grep test.py | grep -v grep
root      75253  0.3  1.6 123984 67360 pts/41   S+   22:03   0:03 python test.py
~~~

So it is nearly 47KB for each keystone client object.

[1]: http://elmiko.github.io/2014/06/10/keystone-trust-delegation.html

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
