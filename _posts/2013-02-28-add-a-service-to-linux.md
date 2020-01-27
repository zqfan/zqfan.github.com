---
layout: post
title: "Add A Service To Linux"
description: ""
category: linux
tags: [linux, python, bash, system service]
---

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## an amazing program 
    
    $ cat truth
    #! /usr/bin/env python
    while True:
        print "God's in his heaven. All' right with the world."
        print "-- Robeert Browning"

now, i want this program can be used everywhere

    $ chmod u+x truth
    $ sudo mv truth /usr/bin
    
does it work?

    $ truth
    God's in his heaven. All' right with the world.
    -- Robeert Browning
    God's in his heaven. All' right with the world.
    -- Robeert Browning
    ...

the truth is going crazy and won't stop, so press CTRL+C to stop it    
## a system service
now i want it to be a system service, but, firstly, what is a system service?

    $ cat /etc/init.d/truth
    ### BEGIN INIT INFO
    # Provides:          truth
    # Required-Start:    $local_fs $remote_fs
    # Required-Stop:
    # Default-Start:     2 3 4 5
    # Default-Stop:
    # Short-Description: truth
    # Description: a simple truth
    ### END INIT INFO
    set -e
    case "$1" in
        start|restart)
            echo "yeah, i'm alive!"
            ;;
        stop)
            echo "oh no! i don't want to die!"
            ;;
        *)
            echo "Usage: truth {start|stop|restart}" >&2
            exit 1
            ;;
    esac
    exit 0

    
    $ ls -l /etc/init.d/truth
    -rwxr--r-- 1 root root 226 Mar  1 19:31 /etc/init.d/truth

    $ sudo service truth start
    yeah, i'm alive!
    $ sudo service truth stop
    oh no! i don't want to die!

so i just create a simple bash script which accept some regular arguments for service. now i can use the truth just as a service.

but i don't want the useless output, i want the TRUTH, so i change the /etc/init.d/truth, remove the echo statement and replace it by:

    start|restart)
        truth > /tmp/truth &
        ;;
    stop)
        echo "oh no! i don't want to die!"
        ;;

you know what would happen, so i just show you:
    
    $ sudo service truth start

ah ha, it quiet, but i know there is a background thread which will silently eat my entire disk, so i check it

    $ tail -f /tmp/truth
    God's in his heaven. All' right with the world.
    -- Robeert Browning
    God's in his heaven. All' right with the world.
    -- Robeert Browning
    ...

no, i want to stop it, so i press CTRL+C, but it doesn't work, the print of `tail -f` dispeared but the thread is still there, and may be it can:

    $ sudo service truth stop
    oh no! i don't want to die!
    $ tail -f /tmp/truth
    God's in his heaven. All' right with the world.
    -- Robeert Browning
    God's in his heaven. All' right with the world.
    -- Robeert Browning
    ...

shit! so i must kill it by 

    $ ps aux | grep truth
    $ sudo kill 1219

how can i stop it by `sudo service truth stop`? oh, i'm so tired, may be next time i will tell you
    
