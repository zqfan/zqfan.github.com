---
layout: post
title: "SuSE Configuration"
description: ""
category: Linux
tags: [suse]
---

# network
Sample in /etc/sysconfig/network/ifcfg-eth0

    BOOTPROTO=static
    IPADDR=180.1.1.77
    NETMASK=255.255.255.0
    NETWORK=180.1.1.0
    BROADCAST=180.1.1.255
    GATEWAY=180.1.1.1
    STARTMODE=onboot

`service network restart`

# sshd
## config sshd
Open /etc/ssh/sshd.config and
- set PasswordAuthentication to yes
- set PermitRootLogin to yes

then restart sshd: `/etc/init.d/sshd restart`

## config firewall
Open /etc/sysconfig/SuSEfirewall2 and
- set `FW_SERVICES_EXT_TCP` = "22"
- set `FW_SERVICES_EXT_UDP` = "23"

then restart firewall: `rcSuSEfirewall2 restart`

# ftp
Open /etc/sysconfig/SuSEfirewall2 and
- set `FW_SERVICES_EXT_TCP` = "ftp 22"

vsftp is a popular choice, we can install it via the following steps:

1. download: `wget http://mirror.linux.or.id/sles11sp164/suse/x86_64/vsftpd-2.0.7-4.17.1.x86_64.rpm`
2. install: `rpm -i vsftpd-2.0.7-4.17.1.x86_64.rpm`
3. start: `/etc/init.d/vsftpd start`
4. set as system service: `chkconfig vsftpd on`

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
