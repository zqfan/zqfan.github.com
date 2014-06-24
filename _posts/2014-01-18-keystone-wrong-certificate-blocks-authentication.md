---
layout: post
title: "Keystone Wrong Certificate Blocks Authentication"
description: "OpenStack Havana problems"
category: "openstack"
tags: [Havana, Keystone]
---
{% include JB/setup %}
OpenStack now is deployed on various operating system, problems will come up even you've already configured it exactly as the manual tells you, they are paticular environment or operation problems rather than bugs.

## Problem

You will see the following error in particular service's log:

~~~
CalledProcessError: Command 'openssl' returned non-zero exit status 4
~~~

My environment is OpenStack Havana 2013.2.2dev on SLES SP3, and when I try to use neutron command, it fails:

~~~
# neutron net-list
Authentication required
~~~

log in /var/log/neutron/neutron-server.log

    WARNING keystoneclient.middleware.auth_token [-] Verify error: Command 'openssl' returned non-zero exit status 4
    DEBUG keystoneclient.middleware.auth_token [-] Token validation failure. _validate_user_token /usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py:820
    TRACE keystoneclient.middleware.auth_token Traceback (most recent call last):
    TRACE keystoneclient.middleware.auth_token   File "/usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py", line 808, in _validate_user_token
    TRACE keystoneclient.middleware.auth_token     verified = self.verify_signed_token(user_token)
    TRACE keystoneclient.middleware.auth_token   File "/usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py", line 1165, in verify_signed_token
    TRACE keystoneclient.middleware.auth_token     if self.is_signed_token_revoked(signed_text):
    TRACE keystoneclient.middleware.auth_token   File "/usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py", line 1127, in is_signed_token_revoked
    TRACE keystoneclient.middleware.auth_token     revocation_list = self.token_revocation_list
    TRACE keystoneclient.middleware.auth_token   File "/usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py", line 1217, in token_revocation_list
    TRACE keystoneclient.middleware.auth_token     self.token_revocation_list = self.fetch_revocation_list()
    TRACE keystoneclient.middleware.auth_token   File "/usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py", line 1247, in fetch_revocation_list
    TRACE keystoneclient.middleware.auth_token     return self.cms_verify(data['signed'])
    TRACE keystoneclient.middleware.auth_token   File "/usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py", line 1160, in cms_verify
    TRACE keystoneclient.middleware.auth_token     raise err
    TRACE keystoneclient.middleware.auth_token CalledProcessError: Command 'openssl' returned non-zero exit status 4
    TRACE keystoneclient.middleware.auth_token
    DEBUG keystoneclient.middleware.auth_token [-] Marking token 7828a6531a2ffb064f2bd2496e44c860 as unauthorized in memcache _cache_store_invalid /usr/lib64/python2.6/site-packages/keystoneclient/middleware/auth_token.py:1068

### Solution

`rm /var/lib/neutron/keystone-signing/*`

Keystone signs the information in auth token with a certificate that in most setups was generated for that instance of keystone. OpenStack service will use auth_token middleware to fetch the certificates of keystone so that it can verify that the tokens are correct. see [http://lists.openstack.org/pipermail/openstack/2013-October/002579.html](http://lists.openstack.org/pipermail/openstack/2013-October/002579.html)

If you're using other service like swift as the reference link mentioned, you can use `rm /var/lib/swift/keystone-signing/*`. Remember that the certificate directory is configurable and can point to somewhere else instead of standard `/var/lib/neutron`, you can check it in you `/etc/neutron/neutron.conf`.

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
