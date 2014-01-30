---
layout: post
title: "Install Ubuntu From Hard Disk"
description: ""
category: "linux"
tags: []
---
{% include JB/setup %}
If you don't have (or don't want to use) USB device or RW-CD-ROM to install operating system, you can do that via hard disk. This post introduces a way to install OS by grub which is verified on Ubuntu Precise.

Download the operating system ISO file from Internet, for example:

    wget http://releases.ubuntu.com/12.04/ubuntu-12.04.3-desktop-amd64.iso

You can download http://releases.ubuntu.com/12.04/ubuntu-12.04.3-desktop-amd64.iso.torrent and use Transmission BitTorrent Client to open it to accelerate the speed.

Move the ISO file to a proper place, which is easy to explorer, for exampe:

    sudo cp ubuntu-12.04.3-desktop-amd64.iso /ubuntu.iso

Reboot you system and press SHIFT after BIOS check is done, then you'll enter the boot menu to select operating system, press `c` to enter grub shell. Note that we need the `/` partition place for grub, which means that `(hd0, msdos1)` may be different in you computer, for me, I only have one hard disk, so it is hd0, you can double press TAB after you input `(hd0,`, the grub will list the partitions you have, then you can select the proper one.

    loopback loop (hd0, msdos1)/ubuntu.iso
    set root=(loop)
    linux /casper/vmlinuz.efi boot=casper iso-scan/filename=/ubuntu.iso
    initrd /casper/initrd.lz
    boot

Then you will enter Ubuntu Live system, remebter to umount the isodevice before you click the Install icon on the desktop, press `CTRL+ALT+T` to open shell:

    umount -l /isodevice

Double click the Install icon on the desktop, everything else is exactly the same as a CD-ROM, enjoy!

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
