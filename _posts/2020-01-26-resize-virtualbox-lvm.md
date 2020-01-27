---
layout: post
title: "Resize VirtualBox LVM"
description: ""
category: 
tags: []
---

When you launch a virtual machine with VirtualBox, the disk space may be far more enough at that time, let's say 20 GB. But after a long time, too many softwares are installed, it may become short. So you have to resize the disk space, if you do not want to deploy a new one and start it over. This article discuss how to do it for a guest linux operating system with LVM storage.

## Resize VDI File

Warning: If you don't want to lose your data, backup is strongly recommended. VirtualBox can export virtual machines, use it wisely.

Go to your VirtualBox installation path, for me, it is `F:\Program Files\Oracle\VirtualBox`, there is an executable file named `VBoxManage.exe`. Press `Shift` key and right click to open a command line window, run command `VBoxManage.exe list hdds` and you might get message:

```
F:\Program Files\Oracle\VirtualBox>VBoxManage.exe list hdds
UUID:           b889a3a4-b6d4-4109-be18-d17c5f7f883e
Parent UUID:    base
State:          locked write
Type:           normal (base)
Location:       F:\VirtualBox VMs\ubuntu1604\ubuntu1604.vdi
Storage format: VDI
Capacity:       20000 MBytes
Encryption:     disabled
```

Run command `VBoxManage.exe modifyhd <UUID> --resize <new size in MB>` to resize it. (Note that using `Location` instead of `UUID` might fail with message `vboxmanage.exe: error: Could not get the storage format of the medium <Location> (VERR_NOT_SUPPORTED)`.) You have to specify a value large than current `Capacity`, because VirtualBox can only increase disk space. For instance, `VBoxManage.exe modifyhd b889a3a4-b6d4-4109-be18-d17c5f7f883e --resize 500000`

Now you can check your virtual machine's storage in VirtualBox panel, if it doesn't change, close and open VirtualBox again.

## Resize LVM

After boot your virtual machine and log into it, you might notice that your disk is still out of space.

```
root@ubuntu:/home/zqfan# df -lh
Filesystem                   Size  Used Avail Use% Mounted on
udev                         981M     0  981M   0% /dev
tmpfs                        201M  3.2M  197M   2% /run
/dev/mapper/ubuntu--vg-root   18G   16G  313M  99% /
tmpfs                       1001M     0 1001M   0% /dev/shm
tmpfs                        5.0M     0  5.0M   0% /run/lock
tmpfs                       1001M     0 1001M   0% /sys/fs/cgroup
/dev/sda1                    472M  106M  342M  24% /boot
virtualBoxShares             313G  208G  105G  67% /media/sf_virtualBoxShares
tmpfs                        201M     0  201M   0% /run/user/1000
```

This is because your disk space is increased but it is still not partitioned yet, hence you cannot not use them. Run `fdisk -l` to check:

```
root@ubuntu:/home/zqfan# fdisk -l
Disk /dev/sda: 48.8 GiB, 52428800000 bytes, 102400000 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x46bb1322

Device     Boot   Start      End  Sectors  Size Id Type
/dev/sda1  *       2048   999423   997376  487M 83 Linux
/dev/sda2       1001470 41940991 40939522 19.5G  5 Extended
/dev/sda5       1001472 41940991 40939520 19.5G 8e Linux LVM


Disk /dev/mapper/ubuntu--vg-root: 17.5 GiB, 18811453440 bytes, 36741120 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


Disk /dev/mapper/ubuntu--vg-swap_1: 2 GiB, 2147483648 bytes, 4194304 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
```

### Partition Disk

Now we need to add a new partition, run `fdisk /dev/sda`, and then:

1. input `n` for new one,
1. input `p` (or press `Enter` key directly because it is the default choice) for primary type,
1. press `Enter` key directly to choose the default partition number, 
1. **WARNING** input First sector carefully, it should be right after the End sector in the above `fdisk -l` output, which means `41940991` plus one, finally is `41940992`
1. press `Enter` key directly to choose End sector to be the last one, which means use all left free space.

The screen log might be:

```
root@ubuntu:/home/zqfan# fdisk /dev/sda

Welcome to fdisk (util-linux 2.27.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): n
Partition type
   p   primary (1 primary, 1 extended, 2 free)
   l   logical (numbered from 5)
Select (default p): p
Partition number (3,4, default 3): 
First sector (999424-102399999, default 999424): 41940992
Last sector, +sectors or +size{K,M,G,T,P} (41940992-102399999, default 102399999): 

Created a new partition 3 of type 'Linux' and of size 28.8 GiB.
```

Use `p` command to check current settings:

```
Command (m for help): p
Disk /dev/sda: 48.8 GiB, 52428800000 bytes, 102400000 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x46bb1322

Device     Boot    Start       End  Sectors  Size Id Type
/dev/sda1  *        2048    999423   997376  487M 83 Linux
/dev/sda2        1001470  41940991 40939522 19.5G  5 Extended
/dev/sda3       41940992 102399999 60459008 28.8G 83 Linux
/dev/sda5        1001472  41940991 40939520 19.5G 8e Linux LVM

Partition table entries are not in disk order.
```

Now we have a new partition `/dev/sda3`, but we need some modification. Note that the disk type is `Linux` instead of target `Linux LVM`, use `t` command to modify:

1. choose partition number we just created, it is `3` in this example
1. input `8e` for `Linux LVM` type

The screen log might be:

```
Command (m for help): t
Partition number (1-3,5, default 5): 3
Partition type (type L to list all types): 8e

Changed type of partition 'Linux' to 'Linux LVM'.
```

Use `p` command to check current settings:

```
Command (m for help): p
Disk /dev/sda: 48.8 GiB, 52428800000 bytes, 102400000 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x46bb1322

Device     Boot    Start       End  Sectors  Size Id Type
/dev/sda1  *        2048    999423   997376  487M 83 Linux
/dev/sda2        1001470  41940991 40939522 19.5G  5 Extended
/dev/sda3       41940992 102399999 60459008 28.8G 8e Linux LVM
/dev/sda5        1001472  41940991 40939520 19.5G 8e Linux LVM

Partition table entries are not in disk order.
```

Use `w` command to save the settings:

```
Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Re-reading the partition table failed.: Device or resource busy

The kernel still uses the old table. The new table will be used at the next reboot or after you run partprobe(8) or kpartx(8).
```

### Extend LVM

Run command `pvscan` to check current physical volume:

```
root@ubuntu:/home/zqfan# pvscan 
  PV /dev/sda5   VG ubuntu-vg       lvm2 [19.52 GiB / 0    free]
  Total: 1 [19.52 GiB] / in use: 1 [19.52 GiB] / in no VG: 0 [0   ]
```

Run command `pvcreate /dev/sda3` to make new disk to be physical volume:

```
root@ubuntu:/home/zqfan# pvcreate /dev/sda3
  Physical volume "/dev/sda3" successfully created
root@ubuntu:/home/zqfan# pvscan 
  PV /dev/sda5   VG ubuntu-vg       lvm2 [19.52 GiB / 0    free]
  PV /dev/sda3                      lvm2 [28.83 GiB]
  Total: 2 [48.35 GiB] / in use: 1 [19.52 GiB] / in no VG: 1 [28.83 GiB]
```

Note, if it fail with message `Device /dev/sda3 not found (or ignored by filtering).`, you will need to `reboot` your virtual machice.

Now extend it to your volume group via `vgextend ubuntu-vg /dev/sda3`:

```
root@ubuntu:/home/zqfan# vgextend ubuntu-vg /dev/sda3
  Volume group "ubuntu-vg" successfully extended
root@ubuntu:/home/zqfan# pvscan 
  PV /dev/sda5   VG ubuntu-vg       lvm2 [19.52 GiB / 0    free]
  PV /dev/sda3   VG ubuntu-vg       lvm2 [28.83 GiB / 28.83 GiB free]
  Total: 2 [48.35 GiB] / in use: 2 [48.35 GiB] / in no VG: 0 [0   ]
```

Modify your logic volume via `lvextend -l +100%FREE /dev/mapper/ubuntu--vg-root`:

```
root@ubuntu:/home/zqfan# lvextend -l +100%FREE /dev/mapper/ubuntu--vg-root
  Size of logical volume ubuntu-vg/root changed from 17.52 GiB (4485 extents) to 46.35 GiB (11865 extents).
  Logical volume root successfully resized
```

Finally, resize your file system via `resize2fs /dev/mapper/ubuntu--vg-root`:

```
root@ubuntu:/home/zqfan# resize2fs /dev/mapper/ubuntu--vg-root
resize2fs 1.42.13 (17-May-2015)
Filesystem at /dev/mapper/ubuntu--vg-root is mounted on /; on-line resizing required
old_desc_blocks = 2, new_desc_blocks = 3
The filesystem on /dev/mapper/ubuntu--vg-root is now 12149760 (4k) blocks long.
```

Now your increased space is ready for use:

```
root@ubuntu:/home/zqfan# df -lh
Filesystem                   Size  Used Avail Use% Mounted on
udev                         981M     0  981M   0% /dev
tmpfs                        201M  3.2M  197M   2% /run
/dev/mapper/ubuntu--vg-root   46G   16G   28G  37% /
tmpfs                       1001M     0 1001M   0% /dev/shm
tmpfs                        5.0M     0  5.0M   0% /run/lock
tmpfs                       1001M     0 1001M   0% /sys/fs/cgroup
/dev/sda1                    472M  106M  342M  24% /boot
virtualBoxShares             313G  208G  105G  67% /media/sf_virtualBoxShares
tmpfs                        201M     0  201M   0% /run/user/1000
```

## Reference

1. [https://segmentfault.com/a/1190000013812527](https://segmentfault.com/a/1190000013812527)
1. [https://www.cnblogs.com/xueweihan/p/5923937.html](https://www.cnblogs.com/xueweihan/p/5923937.html)

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
