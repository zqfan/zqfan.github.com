---
layout: post
title: "Export OpenStack Instance To Local Image"
description: ""
category: "openstack"
tags: [snapshot]
---
{% include JB/setup %}

# openstack虚拟机导出为镜像文件

## 流程

### 创建快照

注: 这一步在horizon上亦可完成

~~~ bash
# nova help image-create
usage: nova image-create [--poll] <server> <name>

Create a new image by taking a snapshot of a running server.

Positional arguments:
  <server>  Name or ID of server.
  <name>    Name of snapshot.

Optional arguments:

  --poll    Blocks while instance snapshots so progress can be reported.
~~~

### 查询镜像

~~~ bash
# glance image-list --all-tenants
~~~

注1: nova快照后的镜像无法在horizon上查询到, 控制台下glance image-list也无法查看到, 是因为创建时, 镜像的is_public属性为False. 你可以在后台使用glance image-update {image_id} --is-public True来使其公有化.

注2: libvirt1.1.1存在bug, 无法为运行中的虚拟机创建快照(运行创建命令后,glance会再将其删除), 详见https://bugs.launchpad.net/nova/+bug/1244694, libvirt 1.2.0已修复

### 导出镜像

~~~ bash
# glance help image-download
usage: glance image-download [--file <FILE>] [--progress] <IMAGE>

Download a specific image.

Positional arguments:
  <IMAGE>        Name or ID of image to download.

Optional arguments:
  --file <FILE>  Local file to save downloaded image data to. If this is not
                 specified the image data will be written to stdout.
  --progress     Show download progress bar.
~~~

## 测试

测试环境: openstack 2013.2.3 on ubuntu 12.04

### 运行中虚拟机无挂载卷

~~~ bash
# nova boot --flavor 1 --image cirros0.3.1 --nic net-id=0733ad66-6fa2-4770-8fe5-904313a2644d running-without-volume
# nova image-create running-without-volume running-without-volume-snapshot
# glance image-list --all-tenants --name running-without-volume-snapshot
+--------------------------------------+---------------------------------+-------------+------------------+----------+--------+
| ID                                   | Name                            | Disk Format | Container Format | Size     | Status |
+--------------------------------------+---------------------------------+-------------+------------------+----------+--------+
| 02123dd0-8706-4216-92d1-0d4d240b7a71 | running-without-volume-snapshot | qcow2       | bare             | 19070976 | active |
+--------------------------------------+---------------------------------+-------------+------------------+----------+--------+
# glance image-download 02123dd0-8706-4216-92d1-0d4d240b7a71 --file ./export.img
# file export.img
export.img: QEMU QCOW Image (v2), 1073741824 bytes
~~~

### 运行中虚拟机有挂载卷

挂载卷并不会在快照时一同被快照, 你需要单独使用nova volume-snapshot-create来创建卷的快照

~~~ bash
# cinder create 1 --display-name tiny-volume
# cinder list --all-tenants --display-name tiny-volume
+--------------------------------------+-----------+--------------+------+-------------+----------+-------------+
|                  ID                  |   Status  | Display Name | Size | Volume Type | Bootable | Attached to |
+--------------------------------------+-----------+--------------+------+-------------+----------+-------------+
| 77250513-09b4-406f-8bea-c27892febcbf | available | tiny-volume  |  1   |     None    |  false   |             |
+--------------------------------------+-----------+--------------+------+-------------+----------+-------------+
# nova volume-attach running-with-volume 77250513-09b4-406f-8bea-c27892febcbf auto
+----------+--------------------------------------+
| Property | Value                                |
+----------+--------------------------------------+
| device   | /dev/vdb                             |
| serverId | 65b76c96-0f7d-46ac-9403-91bddda968e5 |
| id       | 77250513-09b4-406f-8bea-c27892febcbf |
| volumeId | 77250513-09b4-406f-8bea-c27892febcbf |
+----------+--------------------------------------+
# nova image-create running-with-volume running-with-volume-snapshot
# glance image-list --all-tenants --name running-with-volume-snapshot
+--------------------------------------+------------------------------+-------------+------------------+----------+--------+
| ID                                   | Name                         | Disk Format | Container Format | Size     | Status |
+--------------------------------------+------------------------------+-------------+------------------+----------+--------+
| 57409fef-4e12-4a7d-b062-3d73f05696d2 | running-with-volume-snapshot | qcow2       | bare             | 19595264 | active |
+--------------------------------------+------------------------------+-------------+------------------+----------+--------+
# cinder list --all-tenants
+--------------------------------------+--------+--------------+------+-------------+----------+--------------------------------------+
|                  ID                  | Status | Display Name | Size | Volume Type | Bootable |             Attached to              |
+--------------------------------------+--------+--------------+------+-------------+----------+--------------------------------------+
| 77250513-09b4-406f-8bea-c27892febcbf | in-use | tiny-volume  |  1   |     None    |  false   | 65b76c96-0f7d-46ac-9403-91bddda968e5 |
+--------------------------------------+--------+--------------+------+-------------+----------+--------------------------------------+
# glance image-download 57409fef-4e12-4a7d-b062-3d73f05696d2 --file ./export.img
# file export.img
export.img: QEMU QCOW Image (v2), 1073741824 bytes
~~~

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
