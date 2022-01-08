# Poppy Robot Core

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![Maintainability][code-climate-image]][code-climate-url]

This module is dedicated to remotely drive/query robots of the [Poppy project](https://www.poppy-project.org/en/) family.

Below a script example and its execution:

```js
const { createPoppy, createScript } = require('poppy-robot-core')

const script = createScript()
  .select('all') // Select all motors
  .speed(150) // Set their speeds
  .stiff() // Make them programmatically "drivable"
  .position(0, true) // Then move all motors to position '0' degree awaiting the end of the movement
  .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
  .rotate(30) // and apply them a rotation by +30 degrees.

createPoppy().then(async poppy => {
  await poppy.exec(script)
  // Other nice stuff with the poppy instance, next to this script execution
  ...  
})
```

Next an example of querying registers:

```js
const { createPoppy } = require('poppy-robot-core')

createPoppy().then(poppy => poppy.query(
  ['m1', 'm2'],
  ['present_position', 'goal_position']
)).then(console.log)
// will display
// {
//   m1: {present_position: 10, goal_position: 80},
//   m2: {present_position: 0, goal_position: -90},
// }
```

It has been done aiming to __easily and automatically connect to any kind of/configuration of robot__ driven by the pypot library (a live discovering of the targeted robot is performed in order to get its structure aka aliases and motors).

Note this module is based on the REST API exposed by the pypot library and then, depends on its release (see [prerequisite](#prerequisite)).

## Table of Contents

<!-- toc -->

- [Prerequisite](#prerequisite)
- [Install](#install)
- [Configuring Connection to Poppy](#configuring-connection-to-poppy)
- [Writing Scripts](#writing-scripts)
- [Examples](#examples)
- [API](#api)
- [Known Limitations](#known-limitations)
- [Credits](#credits)
- [License](#license)

<!-- tocstop -->

## Prerequisite

This module requires the __pypot REST API v4.0.0__ aka __Poppy software ^v4.0.0__ installed on robot.

## Install

```shell
npm i poppy-robot-core
```

## Configuring Connection to Poppy

By default, the poppy robot core performs a live discovering of the target robot using default connection settings for a Poppy Ergo Jr aka setting are respectively set to 'poppy.local' and 8080 for host and port for the pypot REST API.

Users can easily set their own settings through optional arguments of the createPoppy factory.

```js
const { createPoppy } = require('poppy-robot-core')

let config = 
  host: poppy1.local,
  port: 8081
}

let poppy = createPoppy(config)
```

Refer to the module [API](#api) for further details or, in an easier way, users can use the [poppy-robot-cli][cli-link] module that re-export api of this module and provides a set of additional functionalities for such purpose (flags automatically appended to the node command line to set hostname/port or using a config file to store them).

## Writing Scripts

The poppy robot core module is provided with a script execution engine and then, users, can write their own scripts to test complex  combination of actions.

Such scripts are written in javascript language but all technical \'difficulties\' have been hidden as much as possible and then, it allows users writing their own scripts without any particular knowledges/skills on javascript.

A set of examples of scripts are available into a dedicated [repository](https://github.com/nbarikipoulos/poppy-examples). In this case too, their javascript-technical matters have been reduced insofar as possible or explained when needed.

At last, users can refers to the [Script API](./doc/api.md#module_poppy-robot-core..Script) for further details.

## Examples

A set of scripts are available into a dedicated [repository](https://github.com/nbarikipoulos/poppy-examples).

## API

See [API.md](./doc/api.md) for more details.

## Known Limitations

- __This module have been only tested with the Poppy Ergo Jr__ (aka with a set of dynamixel XL-320). As it communicates with the robot via the REST API of the pypot library, it should be easily usable with any robots of the poppy family.


- __position/rotate functions of Script/ExtMotorRequest__: Awaiting end of movement _i.e._ setting the 'wait' argument to 'true' is based on the velocity of dynamixel XL-320 in order to compute/estimate the movement duration.
The value is 0.666 degree per second (see [documentation](https://emanual.robotis.com/docs/en/dxl/x/xl320/)).

- __Resolving 'poppy.local'__ is done looking for an __ipv4 address__ and does not support ipv6.

## Credits

- Nicolas Barriquand ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

The poppy-robot-core is MIT licensed. See [LICENSE](./LICENSE.md).

[cli-link]: https://github.com/nbarikipoulos/poppy-robot-cli#readme

[npm-url]: https://www.npmjs.com/package/poppy-robot-core
[npm-image]: https://img.shields.io/npm/v/poppy-robot-core.svg
[standard-url]: https://standardjs.com
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg

[lgtm-url]: https://lgtm.com/projects/g/nbarikipoulos/poppy-robot-core
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/nbarikipoulos/poppy-robot-core.svg?logo=lgtm&logoWidth=18
[code-climate-url]: https://codeclimate.com/github/nbarikipoulos/poppy-robot-core/maintainability
[code-climate-image]: https://api.codeclimate.com/v1/badges/e6e11269379853eae9a8/maintainability
