---
layout: post
title: "Python Cliff"
description: ""
category: python
tags: [python, cliff]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Reference
1. [readthedocs](https://cliff.readthedocs.org/en/latest/)

# cliff
cliff is a framework for building command line programs. It uses plugins to define sub-commands, output formatters, and other extensions.

The cliff framework is meant to be used to create multi-level commands such as subversion and git, where the main program handles some basic argument parsing and then invokes a sub-command to do the work.

## The Application
An cliff.app.App is the main program that you run from the shell command prompt. It is responsible for global operations that apply to all of the commands, such as configuring logging and setting up I/O streams.

##The CommandManager
The cliff.commandmanager.CommandManager knows how to load individual command plugins. The default implementation uses setuptools entry points but any mechanism for loading commands can be used by replacing the default CommandManager when instantiating an App.

## The Command
The cliff.command.Command class is where the real work happens. The rest of the framework is present to help the user discover the command plugins and invoke them, and to provide runtime support for those plugins. Each Command subclass is responsible for taking action based on instructions from the user. It defines its own local argument parser (usually using argparse) and a take_action() method that does the appropriate work.

## The Interactive Application
The main program uses an cliff.interactive.InteractiveApp instance to provide a command-shell mode in which the user can type multiple commands before the program exits. Many cliff-based applications will be able to use the default implementation of InteractiveApp without subclassing it.
