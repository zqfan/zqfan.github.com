---
layout: page
title: "OpenStack Schedule"
description: ""
category: "openstack"
tags: [schedule]
---
{% include JB/setup %}

This page showes what I'm going to do, and what I've done in OpenStack project.

# TODO
* (post) ceilometer-collector mechanism
* (bug) ceilometer mysql storage has bad performance

# WAIT
* (exp) (ceilometer) http head size limit
* (bug) (ceilometer) [delete non-existent alarm return incorrect faultstring](https://bugs.launchpad.net/ceilometer/+bug/1280036)
* (fix) (ceilometerclient) [Adjust Exception inheritance relationship](https://review.openstack.org/#/c/75428/)
* (fix) (heat) [Remove redundant default value None for dict.get](https://review.openstack.org/#/c/75612/)
* (fix) (neutronclient) [Enable hacking H233 rule](https://review.openstack.org/68545)
* (fix( (neutronclient) [Remove cliff-tablib from test-requirements](https://review.openstack.org/#/c/49886/)
* (fix) (neutronclient) [Refactor tests/unit/test_shell.py](https://review.openstack.org/#/c/41615/)
* (fix) (nova) [Fix incorrect kwargs 'reason' for HTTPBadRequest](https://review.openstack.org/#/c/64264/)


# WISH
* nova server name is not injected to hostname
* cinder-volumes is out of space while no volume is created
* (doc) ceilometer mongodb data is overload

# DONE
* 2014.02.25 (doc) update ceilometer havana api v2 online document to version 0.4
* 2014.02.24 (post) [OpenStack Weekly News](http://zqfan.github.io/openstack-weekly.html)
* 2014.02.23 (fix) (api-site) [Add delete method on alarm in Ceilometer API reference](https://review.openstack.org/#/c/75012/)
* 2014.02.21 (fix) (hacking) [Enhance H233 rule](https://review.openstack.org/#/c/68573/)
* 2014.02.21 (fix) (openstack-manuals) [Add ceilometer-alarm-* service for SLES install guide](https://review.openstack.org/#/c/75004/)
* 2014.02.21 (exp) devstack install on dev machine
* 2014.02.20 (post) [Simple Example of Pandoc MarkDown](http://zqfan.github.io/linux/2014/02/20/simple-example-of-pandoc-markdown/)
* 2014.02.19 (fix) (openstack-manuals) [Fix syntax error in controller node sql setup](https://review.openstack.org/#/c/74666/)
* 2014.02.19 (doc) release [ceilometer havana configuration reference](http://zqfan.github.io/assets/doc/ceilometer-configuration-reference.html)
* 2014.02.19 (doc) release [ceiloemter havana api v2 online document](http://zqfan.github.io/assets/doc/ceilometer-havana-api-v2.html), align to version 0.3
* 2014.02.19 (doc) release ceilometer havana api v2 document version 0.4
* 2014.02.18 (doc) release ceilometer havana api v2 document version 0.3
* 2014.02.18 (fix) (openstack-manuals) [Add auth_uri option](https://review.openstack.org/#/c/73307/)
* 2014.02.17 (doc) [ceilometer havana key config option](https://github.com/zqfan/openstack/blob/master/ceilometer/ceilometer-configuration-reference.md)
* 2014.02.15 (doc) ceilometer havana api v2 document
* 2014.02.14 (post) [ceilometer-collector dispatcher extension problem](http://zqfan.github.io/openstack/2014/02/14/no-fresh-data-has-been-collected-by-ceilometer/)
* 2014.02.11 (fix) (oslo) [Avoid failure of test_basic_report on 32 bit OS](https://review.openstack.org/#/c/64385/)
* 2014.02.11 (fix) (identity-api) [Use PUT method for user update](https://review.openstack.org/#/c/69789/)
* 2014.02.08 (fix) (neutron) [Enable hacking H233 rule](https://review.openstack.org/#/c/68536/)
* 2014.02.08 (fix) (openstack-manuals) [replace mongo shell interaction with script](https://review.openstack.org/#/c/71734/)
* 2014.02.07 (fix) (heatclient) [Enable hacking H233 rule](https://review.openstack.org/#/c/68534/)
* 2014.02.04 (fix) (openstack-manuals) [Fix repository and dist-upgrade](https://review.openstack.org/#/c/70553/)
* 2014.02.01 (fix) (openstack-manuals) [Remove redundant package install](https://review.openstack.org/#/c/70509/)
* 2014.01.31 (fix) (api-site) [Replace username with name](https://review.openstack.org/#/c/70078/)
* 2014.01.31 (fix) (requirements) [Ignore egg-info directory](https://review.openstack.org/#/c/68425/)
* 2014.01.30 (fix) (api-site) [Use PUT method for user update](https://review.openstack.org/#/c/69788/)
* 2014.01.29 (fix) (openstack-manuals) [Replace the_service_id_above with shell script](https://review.openstack.org/#/c/68444/)
* 2014.01.28 (fix) (ceilometerclient) [Remove unused import for print_function](https://review.openstack.org/#/c/69518/)
* 2014.01.28 (fix) (ceilometer) [Use explicit http error code for api v2](https://review.openstack.org/#/c/68775/)
* 2014.01.28 (fix) (ceilometer) [Remove unnecessary code from alarm test](https://review.openstack.org/#/c/69557/)
* 2014.01.28 (fix) (ceilometerclient) [Fix typos picked up by misspellings](https://review.openstack.org/#/c/68584/)
* 2014.01.28 (fix) (api-site) [Fix incorrect URI of Ceilometer API v2](https://review.openstack.org/#/c/69347/)
* 2014.01.26 (fix) (devstack) [Remove unnecessary slash from ceilometer endpoint](https://review.openstack.org/#/c/68400/)
* 2014.01.25 (fix) (ceilometer) [Removes use of timeutils.set_time_override](https://review.openstack.org/#/c/67826/)
* 2014.01.25 (fix) (ceilometer) [Fix wrong doc string for meter type](https://review.openstack.org/#/c/68582/)
* 2014.01.24 (fix) (ceilometerclient) [Enable hacking H233 rule](https://review.openstack.org/#/c/68531/)
* 2014.01.24 (fix) (ceilometer) [StringIO compatibility for python3](https://review.openstack.org/#/c/67866/)
* 2014.01.23 (fix) (keystoneclient) [Replace assertTrue with explicit assertIsInstance](https://review.openstack.org/#/c/67409/)
* 2014.01.23 (fix) (openstack-manuals) [Fix wrong indentation of keystone verify](https://review.openstack.org/#/c/68447/)
* 2014.01.23 (fix) (api-site) [Remove tenant_id from neutron subnet URI](https://review.openstack.org/#/c/68010/)
* 2014.01.22 (fix) (ceilometer) [Use DEFAULT section for dispatcher in doc](https://review.openstack.org/#/c/66908/)
* 2014.01.22 (fix) (glance) [Fix inconsistent doc string and code of db_sync](https://review.openstack.org/#/c/67003/)
* 2014.01.22 (fix) (api-site) [Fix redundant sample of subnet single create](https://review.openstack.org/#/c/67999/)
* 2014.01.21 (fix) (ironic) [Replace assertTrue with explicit assertIsInstance](https://review.openstack.org/#/c/67420/)
* 2014.01.18 (fix) (openstack-manuals) [Set multi valued option manually in ceilometer config](https://review.openstack.org/#/c/67042/)
* 2014.01.17 (fix) (openstack-manuals) [Ceilometer endpoint doesn't need last slash](https://review.openstack.org/#/c/66893/)
* 2014.01.16 (fix) (openstack-manuals) [Fix incorrect capitalization in ceilometer install](https://review.openstack.org/#/c/66760/)
* 2014.01.15 (fix) (openstack-manuals) [Restart nova-compute after modify the config file](https://review.openstack.org/#/c/66756/)
* 2014.01.15 (fix) (ceilometerclient) [Supports bash_completion for ceilometerclient](https://review.openstack.org/#/c/63718/)
* 2014.01.15 (fix) (openstack-manuals) [Add a note for ceilometer log_dir on Ubuntu](https://review.openstack.org/#/c/66654/)
* 2014.01.15 (fix) (openstack-manuals) [Add service_credentials for ceilometer-agent-central](https://review.openstack.org/#/c/66517/)
* 2014.01.14 (fix) (openstack-manuals) [Use dynamic catalog for keystone on SUSE](https://review.openstack.org/#/c/66275/)
* 2014.01.13 (fix) (openstack-manuals) [Fix incorrect config of notification_driver](https://review.openstack.org/#/c/66290/)
* 2014.01.13 (fix) (ceilometer) [Fix broken i18n support](https://review.openstack.org/#/c/63777/)
* 2014.01.13 (fix) (oslo) [Fix i18n problem in processutils module](https://review.openstack.org/#/c/43355/)
* 2014.01.10 (fix) (ceilometer) [Empty files should no longer contain copyright](https://review.openstack.org/#/c/63912/)
* 2014.01.10 (fix) (openstack-manuals) [Fix ceilometer collector dispatcher on SLES](https://review.openstack.org/#/c/65613/)
* 2014.01.09 (fix) (heatclient) [Remove vim header](https://review.openstack.org/#/c/64326/)
* 2014.01.09 (fix) (openstack-manuals) [Fix systemctl problem on SLES in ceilometer setup](https://review.openstack.org/#/c/65610/)
* 2014.01.07 (fix) (ceilometer) [Remove redundant code in nova_client.Client](https://review.openstack.org/#/c/64025/)
* 2014.01.02 (fix) (heat) [Empty files shouldn't contain copyright nor license](https://review.openstack.org/#/c/63915/)
* 2014.01.02 (fix) (glance) [Refactor tests.unit.utils:FakeDB.reset](https://review.openstack.org/#/c/64087/)
* 2013.12.29 (fix) (ironic) [Fix wrong message of MACAlreadyExists](https://review.openstack.org/#/c/64053/)
* 2013.12.17 (fix) (heatclient) [Supports bash_completion for heatclient](https://review.openstack.org/#/c/62144/)
