# Poppy Robot Core

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

The Poppy Robot Core module is a pure client side tool developped in [node.js](https://nodejs.org/en/download/)/javascript intending:

- To drive/query robots of the [Poppy project](https://www.poppy-project.org/en/) family with a __simple programmatic approach__,
- To be __easily and automatically bound__ with __any kind of/configuration of robot__ driven by the pypot library through the REST API exposed by this library.

Below a script example and its execution:

```js
const { createPoppy, createScript } = require('poppy-robot-core')

const script = createScript()
  .select('all') // Select all motors
  .speed(150) // Set their speeds
  .stiff() // Make them programmatically "drivable"
  .position(0, true) // Then move all motors to position '0' degree.
  .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
  .rotate(30) // and apply them a rotation by +30 degrees.

createPoppy().then(poppy => {
  poppy.exec(script)  
})
```

Or, using the ECMAScript 2017 async/await features:
```js

const myFunction = async _ => {
  const poppy = await createPoppy()

  const script = createScript('all')
    .speed(150)
    .stiff()
    .position(0, true)
    .select('m1','m2')
    .rotate(30)

  await poppy.exec(script)
  // Other nice stuff with the poppy instance, next to this script execution  
  ...
}

```

This module is mainly based on the following objects:

- The Poppy object that handles:
  - The robot configuration (its structure, connection settings) and motor objects.
  - A script execution engine in order to perform action on motors

- The Motor Objects:
  - ExtMotorRequest that handles high level actions of the motors,
  - RawMotorRequest that handles the low-level rest requests to the motor register,
  - The RequestHandlerObject object in charge of all the requests to the REST API served by the pypot http server.

- The Script object in order to programmatically address and chain request to the motors,
- At last, the PoppyRequestHandler object in charge of querying/set the registers of motors.

Furthermore, it is provided with a bunch of **high-level factories** (see [API.md](./doc/api.md)) in order to facilitate use and settings of these objects such as settings connection parameters, automatically perform a live discovering of the target robot, etc...
The configuration features are detailed [here](#configuring-robot).

## Table of Contents

<!-- toc -->

- [Install](#install)
- [Configuring Robot Connection](#configuring-robot-connection)
- [Write Scripts](#write-scripts)
- [Examples](#examples)
- [API](#api)
- [Known Limitations](#known-limitations)
- [Credits](#credits)
- [License](#license)

<!-- tocstop -->

## Install

```shell
npm i poppy-robot-core
```

## Configuring Robot Connection

By default, the poppy robot core performs a live discovering of the target robot using default connection settings for a Poppy Ergo Jr aka setting are respectively set to 'poppy.local' and 8080 for hostname and port of the pypot REST API.

Users can easily set their own settings through optionnal arguments of the createPoppy factory.

```js
const { createPoppy } = require('poppy-robot-core')

let poppy = createPoppy(config)
```

where config is an object that handles user's configuration and then, overrides default ones.

As example:

```js
let config = {
  connect: { // Connection settings
    hostname: poppy1.local,
    port: 8081
  }
}
```

where the connect property handles the connection settings (full description is available [here](./doc/api.md#module_poppy-robot-core..ConnectionSettings)),

Refer to the module [API](#api) for further details or, in a easiest way, users can use the [poppy-robot-cli module][cli-link] that provides a set of additional functionalities for such purpose (flags automatically appended to the node command line or serialized in a config file).

## Write Scripts

The poppy robot core module is provided with a script execution engine and then, users, can write their own scripts to test complex  combination of actions.

Such scripts are written in javascript language but all technical \'difficulties\' have been hidden as much as possible and then, it allows users writing their own scripts without any particular knowledges/skills on javascript.

A set of examples of scripts are available into a dedicated [repository](https://github.com/nbarikipoulos/poppy-examples). In this case too, their javascript-technical matters have been reduced insofar as possible or explained when needed.

At last, users can refers to the [Script API](./doc/api.md#module_poppy-robot-core..Script) for further details.

## Examples

A set of scripts are available into a dedicated [repository](https://github.com/nbarikipoulos/poppy-examples).

## API

See [API.md](./doc/api.md) for more details.

## Known Limitations

- __position/rotate functions of Script/ExtMotorRequest__: Awaiting end of movement _i.e._ setting the 'wait' argument to 'true' is based on the speed of dynamixel XL320 in order to compute/estimate the movement duration.
The value is 0.666 degree per second (see [documentation](https://github.com/ROBOTIS-GIT/emanual/blob/master/docs/en/dxl/x/xl320.md)).

- __Resolving 'poppy.local'__ is done looking for an __ipv4 address__ and does not support ipv6 (yet?).

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
