---
layout: post
title: "git review"
description: ""
category: "openstack"
tags: []
---
{% include JB/setup %}

### Network is unreachable

~~~
$ git review
Problem running 'git remote update gerrit'
Fetching gerrit
ssh: connect to host review.openstack.org port 29418: Network is unreachable
fatal: The remote end hung up unexpectedly
error: Could not fetch gerrit
~~~

I don't know why but `sudo pip install -U git-review` (version 1.24) can fix it. Note that if you have installed git-review by `apt-get install python-git-review`, you should remove it and use pip to install the latest version.

### Connection timed out

~~~
$ git review
Problem running 'git remote update gerrit'
Fetching gerrit
ssh: connect to host review.openstack.org port 29418: Connection timed out
fatal: The remote end hung up unexpectedly
error: Could not fetch gerrit
~~~

I don't know why, maybe some sort of firewall? using gerrit http password can solve it. [see detail](http://kiwik.github.io/openstack/2014/08/26/git-review%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%E5%A4%B1%E8%B4%A5%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95/).

1. log in [gerrit](https://review.openstack.org)
2. choose `Settings` (on the top right, click your name then click Settings on the pop up menu)
3. choose `HTTP Password` (on the left navigator)
4. click `Generate Password` (if you already have one, skip this step)

Assume your username is `{username}`, and password is `{password}`, and your current working project is `{project}`, then enter that project's working directory, and type `git remote set-url gerrit https://{username}:{password}@review.openstack.org/openstack/{project}.git`. For example, `git remote set-url gerrit https://aji-zqfan:f**kGFW@review.openstack.org/openstack/ceilometer.git`. Note you should encode special keys in url, here is the map, [see stackoverflow](http://stackoverflow.com/questions/6172719/escape-character-in-git-proxy-password):

~~~
!   #   $    &   '   (   )   *   +   ,   /   :   ;   =   ?   @   [   ]
%21 %23 %24 %26 %27 %28 %29 %2A %2B %2C %2F %3A %3B %3D %3F %40 %5B %5D
~~~

HTTP is fine as well, but always use HTTPS, you know.

You may need one more step to submit your change now, for i.e:

~~~
$ git review
Fetching gerrit
From https://review.openstack.org/openstack/ceilometer
   09720bf..c369645  master     -> gerrit/master
   264f3b0..292b4aa  stable/havana -> gerrit/stable/havana
   020a48b..ccd6b98  stable/icehouse -> gerrit/stable/icehouse
Using bug number "bug/1372329" for the topic of the change submitted
Please use the following command to send your commits to review:

    git push gerrit HEAD:refs/publish/master/bug/1372329

$ git push gerrit HEAD:refs/publish/master/bug/1372329
remote: Resolving deltas: 100% (6/6)
remote: Processing changes: new: 1, refs: 1, done
remote:
remote: New Changes:
remote:   https://review.openstack.org/123320
remote:
To https://aji-zqfan:f**kGFW@review.openstack.org/openstack/ceilometer.git
 * [new branch]      HEAD -> refs/publish/master/bug/1372329
~~~

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
