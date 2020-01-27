---
layout: post
title: "Openstack Contribute"
description: ""
category: openstack
tags: [openstack, free software, open source, contribute]
---

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## Why so late

Because i am bound by the company's rule, however i think some contribute may not confict with the company, so i decide to do some little work that may not hurt anyone.

## Steps

* [how to contribute](https://wiki.openstack.org/wiki/HowToContribute)
* [osrs](http://www.slideshare.net/itsmeduh/osrs)
* [gerrit workflow](https://wiki.openstack.org/wiki/GerritWorkflow)

## Basic setup

1. register on launchpad and update ssh key
2. join the openstack teams, and join [OpenStack Foundation](https://www.openstack.org/join/)
3. add ssh key to review.openstack.org, assign CLA, fill your contact info
4. install git-core git-review and set git user.name and user.email

~~~
apt-get install git-core git-review python-dev python-virtualenv
apt-get build-dep python-ldap
~~~

## Fixing the Bug

### ensure git review is configured

~~~
cd nova
git review -s
~~~

if you get the error of "We don't know where your gerrit is" and it will give you a new url, copy it and run the following command. note modify the username to your gerrit user-name.

~~~
git remote add gerrit ${the_url}
~~~

### ensure you have the latest code

~~~
git remote update
git checkout master
git pull origin master
~~~

### create a topic branch

~~~
git checkout -b bug_topic
~~~

### fix the bug

### run tests

~~~
aptitude install eatmydata libmysqlclient-dev libxml2-dev libxslt-dev
eatmydata ./run_tests.sh
~~~

Note, current Nova(Grizzly) use testr [wiki.openstack.org](https://wiki.openstack.org/wiki/Testr) for unit test. you need to install it firstly:

~~~
aptitude install testrepository
~~~

then run:

~~~
./run_tests.sh
~~~

if you meet the error: Error: pg_config executable not found. you can install

~~~
sudo apt-get install libpq-dev python-dev
~~~

### commit the code

~~~
git commit -a
~~~

you should to see [git commit messages](wiki.openstack.org/GitCommitMessages)
The basical format is:

Title short than 50 characters

Long details goes here

Closes-Bug: #123456

### submit for review

~~~
git review
~~~
