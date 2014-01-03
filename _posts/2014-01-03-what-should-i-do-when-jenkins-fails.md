---
layout: post
title: "What Should I Do When Jenkins Fails"
description: ""
category: "openstack"
tags: []
---
{% include JB/setup %}
As an OpenStack code contributor, one of the most common issues will be jenkins failure. You should use `recheck bug ${real_bug_number}` or `recheck no bug` to notify jenkins to restart gate job when patch is in the status of 'Review In Progress', or **`revirify bug ${real_bug_number}`** when 'Approved'.

When jenkins failed, it will append a comment on your patch with a [guide][1] and a list of results of test. You should read that [guide][1] carefully and follow its instructions. And there is a post written by [Chmouel Boudjnah][3] discusses [The life of an OpenStack contributor checking for Jenkins failures][2], which is funny with lots of dynamic pictures.

NOTE: **reverify must follow a bug number or it will not work**, although it is mentioned in the end of the [guide][1], but it is always used in the wrong way of `reverify no bug` since `recheck no bug` can work and it is quite simple to use. I guess the reason why `reverify no bug` cannot work is that every merge should be careful if jenkins failed, so we must dig out the root cause and notify the infra team to handle this bug.

I would suggest you to use `recheck bug ${real_bug_number}` too, since it will be helpful to fix this bug and reduce other's pain. If we all do such good practice, then in future it will help us too.

Firstly, when you receive the jenkins failure comment, if pep8 and/or python27 fail, it is your own fault because you have not run tox before commit this change.

In other cases, click the failed test, and it will jump to a full log of that test, and it already provides a simple guide about how to debug, you can read that too. Click the console.html then scroll to the bottom of console output, then from bottom to up, locate the first failure, it usually would be an unit test failure, copy the name of that unit test case, and search it on [bugs.launchpad.net][4] or [status.openstack.org/rechecks][5], if that bug is already reported, find the bug number, and comment in gerrit with `recheck bug ${real_bug_number}`. If there is no such bug, you can report it on [bugs.launchpad.net/tempest][6]. However, if a same bug is reported and marked as `Invalid`, it will not be listed in the search result, in this rare case, google seems a better choice than launchpad itself.

[1]: https://wiki.openstack.org/wiki/GerritJenkinsGit#Test_Failures
[2]: http://blog.chmouel.com/2013/12/24/life-of-openstack-contributor-jenkins-failure/
[3]: http://stackalytics.com/?release=icehouse&metric=commits&project_type=openstack&module=&company=&user_id=chmouel
[4]: https://bugs.launchpad.net
[5]: http://status.openstack.org/rechecks
[6]: https://bugs.launchpad.net/tempest

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
