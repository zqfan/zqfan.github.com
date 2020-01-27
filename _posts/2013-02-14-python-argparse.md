---
layout: post
title: "Python Argparse"
description: ""
category: Python
tags: [python, argparse]
---

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

first, import it

    >>> import argparse

create an instance

    >>> ap = argparse.ArgumentParser()

add arguments

    >>> ap.add_argument('word')
    >>> ap.add_argument('-n','--net')

parse arguments

    >>> args = ap.parse_args(sys.argv[1:])

## subcommad

    parser = argparse.ArgumentParser()
    sub_parser = parser.add_subparsers()
    parser_command = sub_parser.add_parser('command')
    parser_command.set_defaults(func=func_name)
    parser_command.add_argument('arg')
    args = parser.parse_args(sys.argv[1:])
    d = vars(args)
    func = d.pop('func')
    func(**d)


[official documents](http://docs.python.org/2/library/argparse)

~~~
class argparse.ArgumentParser(prog=None, usage=None, description=None, epilog=None, parents=[], formatter_class=argparse.HelpFormatter, prefix_chars='-', fromfile_prefix_chars=None, argument_default=None, conflict_handler='error', add_help=True)

    description - Text to display before the argument help.
    epilog - Text to display after the argument help.
    add_help - Add a -h/–help option to the parser. (default: True)
    argument_default - Set the global default value for arguments. (default: None)
    parents - A list of ArgumentParser objects whose arguments should also be included.
    prefix_chars - The set of characters that prefix optional arguments. (default: ‘-‘)
    fromfile_prefix_chars - The set of characters that prefix files from which additional arguments should be read. (default: None)
    formatter_class - A class for customizing the help output.
    conflict_handler - Usually unnecessary, defines strategy for resolving conflicting optionals.
    prog - The name of the program (default: sys.argv[0])
    usage - The string describing the program usage (default: generated)
~~~

~~~
ArgumentParser.add_argument(name or flags...[, action][, nargs][, const][, default][, type][, choices][, required][, help][, metavar][, dest])

    name or flags - Either a name or a list of option strings, e.g. foo or -f, --foo.
    action - The basic type of action to be taken when this argument is encountered at the command line.
    nargs - The number of command-line arguments that should be consumed.
    const - A constant value required by some action and nargs selections.
    default - The value produced if the argument is absent from the command line.
    type - The type to which the command-line argument should be converted.
    choices - A container of the allowable values for the argument.
    required - Whether or not the command-line option may be omitted (optionals only).
    help - A brief description of what the argument does.
    metavar - A name for the argument in usage messages.
    dest - The name of the attribute to be added to the object returned by parse_args().
~~~

~~~
ArgumentParser.parse_args(args=None, namespace=None)
    Convert argument strings to objects and assign them as attributes of the namespace. Return the populated namespace.
~~~
