---
layout: post
title: "Server Hardware Problem"
description: ""
category: Other
tags: []
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## I'm not a operator
But they still bother me, because i installed a software on their machine! And they think their machine is solid, although i think software is not worse than hardware. Since i'm a reasonable man and they will ignore their hardware problem again and again, i just write this blog and will continue to update it.

## Read-only filesystem
Sometimes, the system just accidently fall into a status with file system in read only mode, this especially occur on servers with RAID card.

Now, there is a server with DELL RAID card crash by this error *AGAIN*, and since it has run for a long while, data on this server should be kept, but i also don't know how to do, they ask to me for help, but i even cannot use ls command in the file system mount on the RAID driver.

Here is a blog teach me a trick to reboot the system without file system: [Rebooting the Magic Way](http://www.linuxjournal.com/content/rebooting-magic-way).

But how should i backup the data in the server?
