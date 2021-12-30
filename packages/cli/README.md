oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @reflectkit/cli
$ reflectkit COMMAND
running command...
$ reflectkit (--version)
@reflectkit/cli/0.0.0 linux-x64 node-v16.13.0
$ reflectkit --help [COMMAND]
USAGE
  $ reflectkit COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`reflectkit build`](#reflectkit-build)
* [`reflectkit help [COMMAND]`](#reflectkit-help-command)
* [`reflectkit image pack OUTPUT`](#reflectkit-image-pack-output)
* [`reflectkit image unpack INPUT [OUTPUT]`](#reflectkit-image-unpack-input-output)
* [`reflectkit plugins`](#reflectkit-plugins)
* [`reflectkit plugins:inspect PLUGIN...`](#reflectkit-pluginsinspect-plugin)
* [`reflectkit plugins:install PLUGIN...`](#reflectkit-pluginsinstall-plugin)
* [`reflectkit plugins:link PLUGIN`](#reflectkit-pluginslink-plugin)
* [`reflectkit plugins:uninstall PLUGIN...`](#reflectkit-pluginsuninstall-plugin)
* [`reflectkit plugins update`](#reflectkit-plugins-update)

## `reflectkit build`

Build a Reflectkit project

```
USAGE
  $ reflectkit build

DESCRIPTION
  Build a Reflectkit project
```

## `reflectkit help [COMMAND]`

Display help for reflectkit.

```
USAGE
  $ reflectkit help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for reflectkit.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `reflectkit image pack OUTPUT`

Pack an image from files

```
USAGE
  $ reflectkit image pack [OUTPUT]

ARGUMENTS
  OUTPUT  Output file

DESCRIPTION
  Pack an image from files

EXAMPLES
  $ reflectkit image pack image.js
  Wrote image to image.js
```

## `reflectkit image unpack INPUT [OUTPUT]`

Unpack an image into a directory

```
USAGE
  $ reflectkit image unpack [INPUT] [OUTPUT] [--overwrite]

ARGUMENTS
  INPUT   Input image file
  OUTPUT  [default: .] Output directory

FLAGS
  --overwrite  Overwrite existing files

DESCRIPTION
  Unpack an image into a directory

EXAMPLES
  $ reflectkit image unpack image.js unpacked/
  Unpacked image to unpacked/
```

## `reflectkit plugins`

List installed plugins.

```
USAGE
  $ reflectkit plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ reflectkit plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `reflectkit plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ reflectkit plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ reflectkit plugins:inspect myplugin
```

## `reflectkit plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ reflectkit plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ reflectkit plugins add

EXAMPLES
  $ reflectkit plugins:install myplugin 

  $ reflectkit plugins:install https://github.com/someuser/someplugin

  $ reflectkit plugins:install someuser/someplugin
```

## `reflectkit plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ reflectkit plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ reflectkit plugins:link myplugin
```

## `reflectkit plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ reflectkit plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ reflectkit plugins unlink
  $ reflectkit plugins remove
```

## `reflectkit plugins update`

Update installed plugins.

```
USAGE
  $ reflectkit plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
