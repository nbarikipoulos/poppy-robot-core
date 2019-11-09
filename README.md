# Poppy Robot Core

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

The Poppy Robot Core mode is a pure client side tool developped in [node.js](https://nodejs.org/en/download/)/javascript which intends:

- to drive robots of the [Poppy project](https://www.poppy-project.org/en/) family, or at least the Poppy Ergo Jr, with a __simple programmatic approach__,
- to be easily bound with any robot driven by the pypot library.

Below a script example and its execution:

```js
const P = require('poppy-robot-core')

let script = P.createScript()
  .select('all') // Select all motors
  .compliant(false) // Make them "drivable"
  .speed(150) // Set their speed
  .position(0) // and move all motors to position 'O' degree.
  .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
  .rotate(30) // and apply them a rotation by +30 degrees.

const poppy = P.createPoppy()
poppy.exec(script)
```

This module is mainly based on the following objects:

- The Poppy object which handles:
  - The robot configuration and then, the motors objects handled by the robot,
  - A script execution engine.

- The Motor Objects:
  - ExtMotorRequest which handles high level actions of the motors,
  - RawMotorRequest which handles the low-level rest requests to the motor registry,
  - The RequestHandlerObject object in charge of all the requests to the http server.

- The Script object in order to programmatically address and chain request to the motors.

It has been __first developped and tested with the Poppy Ergo Jr__ and then, it is configured by default to fit with it but __advanced users' can easily set their own robot configurations__ with both any set of motors driven through the pypot library or connection settings as detailed [here](#configuring-robot).

Note another module named [poppy-robot-cli][cli-link] appends to this module a set of common cli flags and tool to ease the modification of connection parameters of discover another Poppy configurations than the Ergo jr one which is used as default by this module.

## Table of Contents

<!-- toc -->

- [Install](#install)
- [Configuring Robot](#configuring-robot)
- [Write Scripts](#write-scripts)
- [Examples](#examples)
- [API](#api)
- [Credits](#credits)
- [License](#license)

<!-- tocstop -->

## Install

```shell
npm i poppy-robot-core
```

## Configuring Robot

By default, the poppy robot core use default configuration for a Poppy Ergo Jr _i.e._:

- The descriptor of the robot fit by the set of motors as well as their properties (name, angle range) for an Ergo Jr,
- Connection settings are compliant with default one aka the REST API served by pypot and the snap server port (used for led settings of dynamixel xl-320) use respectively the 8080 and 6969 ports.

Users can easily set their own settings through optionnal arguments of the createPoppy factory.

```js
const P = require('poppy-robot-core')

let poppy = P.createPoppy(config)
```

where config is an object that handles user's configuration and then, overrides default ones.

As example:

```js
let config = {
    connect: { // Connection settings
        ip: poppy1.local,
        httpPort: 8081
    },
    descriptor: 'file://myPoppy.json'
}
```

where:

- The connect property handle the connection settings (full description is available [here](./doc/api.md#module_poppy-robot-core..ConnectionSettings)),
- The descriptor is a 'URI'-like to a local descriptor file handling the motors configuration. As example of structure for such descriptor, this module embeds a descriptor for the Poppy Ergo Jr: [config/poppy-ergo-jr.json](./config/poppy-ergo-jr.json).

Note in a easiest way, users can use the [poppy-robot-cli module][cli-link] which provides a set of tools (flags automatically appended to the cli or discovering features) for such purposes.

## Write Scripts

The poppy robot core module is provided with a script execution engine and then, users, can write their own scripts to test complex  combination of actions.

Such scripts are written in javascript language but all technical \'difficulties\' have been hidden as much as possible and then, it allows users writing their own scripts without any particular knowledges/skills on javascript.

A set of examples of scripts are available into a dedicated [repository](https://github.com/nbarikipoulos/poppy-examples). In this case too, their javascript-technical matters have been reduced insofar as possible or explained when needed.

At last, users can refers to the [Script API](./doc/api.md#module_poppy-robot-core..Script) for further details.

## Examples

A set of scripts are available into a dedicated [repository](https://github.com/nbarikipoulos/poppy-examples).

## API

See [API.md](./doc/api.md) for more details.

## Credits

- Nicolas Barriquand ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

The poppy-robot-core is MIT licensed. See [LICENSE](./LICENSE.md).

[cli-link]: https://github.com/nbarikipoulos/poppy-robot-cli#readme

[npm-url]: https://www.npmjs.com/package/poppy-robot-core
[npm-image]: https://img.shields.io/npm/v/poppy-robot-core.svg
[standard-url]: https://standardjs.com
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg

[david-image]: https://img.shields.io/david/nbarikipoulos/poppy-robot-core.svg
[david-url]: https://david-dm.org/nbarikipoulos/poppy-robot-core
[david-dev-image]: https://img.shields.io/david/dev/nbarikipoulos/poppy-robot-core.svg
[david-dev-url]: https://david-dm.org/nbarikipoulos/poppy-robot-core?type=dev
