# Poppy (Ergo Jr) Robot Client

The Poppy Robot Client is a pure client side tool developped in [node.js](https://nodejs.org/en/download/)/javascript which intends to "replace" the snap UI with a __simple programmatic approach__ to drive robots of the [Poppy project](https://www.poppy-project.org/en/) family, or at least the Poppy Ergo Jr.

It allows addressing the poppy robot in 2 modes:
- A [CLI Mode](##CLI-Mode) to query and send basic set instructions to the motor registries and then, to allow performing unary 'action' on motors such as move, speed settings, simply typing in a command line terminal,
- A [script exectution mode](#Writing-your-own-Scripts) to simply combine these basic instructions in order to test more complex motions. It is done writing script using the javascript language where all technical 'difficulties' have been hidden as much as possible and then, it allows users writing their own scripts without any particular knowledges/skills on javascript.

It has been first developped and tested with the Poppy Ergo Jr. It does not discover the installed motors on Poppy (it could) but through a "lazy" mode: they are listed in a configuration file.
It uses the REST api exposed by the http server of the pypot library and could be probably used with any other configurations based on pypot.

Furthermore, note this first release only aims to replace the 'compliant-mode-set-to-false' behaviour (sic) of the motors _i.e._ no motion recording has been developped (yet).

Enjoy, ;)

## Table of Contents

<!-- toc -->

- [TLTR;](#tltr)
- [Getting Started](#getting-started)
  * [Installing node.js](#installing-nodejs)
  * [Installing the poppy-robot-client module](#installing-the-poppy-robot-client-module)
- [Usage](#usage)
- [CLI Mode](#cli-mode)
  * [Querying](#querying)
  * [Executing Single Command](#executing-single-command)
    + [compliant](#compliant)
    + [speed](#speed)
    + [rotate](#rotate)
    + [position](#position)
    + [led](#led)
- [Writing your own Scripts](#writing-your-own-scripts)
  * [Creating a Script file](#creating-a-script-file)
    + [File Header](#file-header)
    + [Defining the Scripts themselves](#defining-the-scripts-themselves)
    + [Executing Scripts](#executing-scripts)
  * [The Script Object](#the-script-object)
    + [script.select(...motors) ⇒ ```this```](#scriptselectmotors-%E2%87%92-this)
    + [script.compliant(value) ⇒ ```this```](#scriptcompliantvalue-%E2%87%92-this)
    + [script.speed(value) ⇒ ```this```](#scriptspeedvalue-%E2%87%92-this)
    + [script.rotate(value, [wait]) ⇒ ```this```](#scriptrotatevalue-wait-%E2%87%92-this)
    + [script.position(value, [wait]) ⇒ ```this```](#scriptpositionvalue-wait-%E2%87%92-this)
    + [script.led(value) ⇒ ```this```](#scriptledvalue-%E2%87%92-this)
    + [script.wait(value) ⇒ ```this```](#scriptwaitvalue-%E2%87%92-this)
- [Examples](#examples)
- [API](#api)
- [Credits](#credits)
- [License](#license)

<!-- tocstop -->

## TLTR;

You just have to install this node module on your local computer, to turn on your Poppy and enjoy.

The next line will globally install the module on your computer (more details are available [here](###installation)):
```shell
npm install poppy-robot-client -g
```

Then type:
```shell
poppy -h
```
To access to the inline help provided with the cli which allows both querying and sending simple command to the motors of the robot.

Note, once the Poppy switches on and ready (green light blinking), the __init__ command must be performed first.

Next to the CLI uses, this module allows users writing their own (simple) scripts to test more complex actions such as some motions, and so on as explained [here](#Writing-your-own-Scripts). A set of examples are provided [there](##Examples)

## Getting Started

### Installing node.js

the poppy-robot-client is intented to be used under a node.js 'environment' on your local computer. Thus it should be first installed (sic):
- Downloading it from its [official site](https://nodejs.org/en/download/),
- Or using a node version manager such as nvm (macos/linux version or Windows one are respectively available [here](https://github.com/creationix/nvm) and [there](https://github.com/coreybutler/nvm-windows)).

Note a node.js release equal or higher to 8.0.0 is required.

### Installing the poppy-robot-client module

Once [node.js](https://nodejs.org/en/download/) installed, type:
```shell
npm i poppy-robot-client --global
```
that will globally install the poppy-robot-client module.

To verify that it has been successfully installed, type:
```shell
npm list -g -depth=0
├── npm@5.6.0
└── poppy-robot-client@0.1.0 
```

Then, simply type:

```shell
poppy -h
```
will display the basic help about the poppy-robot-cli.

## Usage

Once installed, both CLI mode and scripting mode are addressable without any other settings.

__Note a specific command must be performed at each Poppy switching on in order to properly initialize the embedded http server in Poppy.__

Next the Poppy robot turns on and is ready (green light blinking), the following command should be performed first:
```shell
poppy exec init
```

If not performed, the first command/request send to the Poppy next to switching it on will systematically failed, next ones will succeed.

## CLI Mode

The cli commands are divided into 2 parts:
- A querying module to get information about the motors,
- A command module which allows sending simple commands to the motors.

### Querying

First group of cli commands allows querying the register of the motors of the robot.

Typing:
```shell
poppy query
```
will return data about all registers 'of interest' for all motors.

![Querying command](./doc/query.png "Querying command")

Adding the flag -h will display help for optional options:
- -m to select the motor(s) to query,
- -r to select the register(s) to query,
- -i to invert the output table form register/motor to motor/register.

As example the following line will only display the temperature of the motors m1 and m5:
```shell
poppy query -m m2 m3 m4 m5 -r present_position goal_position -i
```
![Querying command 2](./doc/query_1.png "Querying command 2")

### Executing Single Command

Next group of cli commands allows executing a single command to targeted motors. It groups a bunch of commands whose helps are accessible through this command:
```shell
poppy exec <command> -h
```

where the &lt;command&gt; are listed in the table below:

name | description
--- | ---
[compliant](####compliant) | modify the 'compliant' state of motor(s)
[speed](####speed) | set the speed of target motor(s)
[rotate](####rotate) | rotate the selected motor(s) by x degrees
[position](####position) | move the selected motor(s) to a given position.
[led](####led) | set the led color of selected motor(s)


All these commands have a common flag '-m'. If not set, a command will be applied to all motors ('m1' to 'm6 for the Poppy Ergo Jr.) excepted if this flag is set on the CLI. In this case, it allows to select the targeted motors on which will apply the command.

As examples: 
```shell
poppy exec led -v green
```
will set the led color to green of all motors.

```shell
poppy exec -m m1 m2 -v blue
````
will set the led color of motor m1 and m2 to blue.

Next paragraphs will detail all the available execution commands and their specific options.

#### compliant

This command sets the compliant state of the selected motor(s).

option | desc | value | default | mandatory
--- | --- | --- | --- | ---
-v | set the value of the 'compliant' register | [on, off] | off | no


Examples:

- Switch all motors compliant state to 'false' _i.e._ motors are programmatically addressable:
    ```shell
    poppy exec compliant
    ```
- Same as previous example, but longer...:
    ```shell
    poppy exec compliant -v off
    ```
- Switch all motors to the 'rest' state _i.e._ motors are movable by hand but not programmatically adressable:
    ```shell
    poppy exec compliant -v on
    ```

#### speed

This command sets the the rotation speed of the selected motor(s).

option | desc | value | default | mandatory
--- | --- | --- | --- | ---
-v | set 'goal_speed' register | an integer in the [0, 1023] range | n.a. | yes

Examples:

-  Set the rotation speed of all motors to 100 (slower):
    ```shell
    poppy exec speed -v 100
    ```
- Set the rotation speed of the motors m1 and m2 to 500 (quicker):
    ```shell
    poppy exec speed -m m1 m2 -v 500
    ```

#### rotate

This command rotates the target motor(s) by x degrees from the current position.

option | desc | value | default | mandatory
--- | --- | --- | --- | ---
-v | the rotation by value | integer | n.a. | yes
-w | wait until the rotation will finish | boolean | false | no

Examples:

- Rotate the motors m1 and m2 by -30 degrees and wait until each motors will reach its new position:
    ```shell
    cli exec rotate -m m1 m2 -v -30 -w
    ```

#### position

This command sets the target position of the selected motor(s) _i.e._ it will move these motors to a given positions.

option | desc | value | default | mandatory
--- | --- | --- | --- | ---
-v | set the 'target_position' register| integer | n.a. | yes
-w | wait until the motor(s) will reach this new positions  | boolean | false | no

Examples:

- Move all motors to the 0 degree position asynchrously _i.e._ all motors will reach this position independently:
    ```shell
        poppy exec position -v 0
    ```

- Move all motors to the 0 degree position sequentially _i.e._ for each motor, a request to send this position will be send, and it will await before the end of this action before proceding it to the next motor.:
    ```shell
        poppy exec position -v 0 -w
    ```

- Move the motors m1 and m2 to the 0 degree position and wait until each motors will reach its new position:
    ```shell
    poppy exec position -m m1 m2 -v 90 -w
    ```

#### led

This command sets the led color of the selected motor(s).

option | desc | value | default | mandatory
--- | --- | --- | --- | ---
-v | set the 'led' register| [off, red, green, blue, yellow, cyan, pink, white] | off | no

Examples:

- Turn off the led of all motors:
    ```shell
    poppy exec led
    ```
- Set the led color of motor 'm3' to 'green':
    ```shell
    poppy exec led -m m3 -v green
    ```

## Writing your own Scripts

Next to the CLI uses, users can write their own scripts to test more complex  combination of actions.

Such scripts are written in javascript language but all technical \'difficulties\' have been hidden as much as possible and then, it allows users writing their own scripts without any particular knowledges/skills on javascript.

Note Such approach has been retained for [examples](##Examples) provided with this project _i.e._ their javascript-technical matters are reduced insofar as possible.

Thus, this section will describe the complete _modus operandi_ in order to _ab initio_ create a script file as well as detailed parts about writing your script and executions purposes. 
Advanced users could refers to the project [API](#API)
 for advanced topics.

### Creating a Script file

Any script files are javascript files interpreted by the javascript motor embedded in node.js.

#### File Header

All script files should start with the following code:

```js
'use strict'

const P = require('poppy-robot-client');
```

where:
- The first line is a common best pratice rule,
- The second one imports the poppy-robot-client module.

Next to this step, some scripts can be added to the file.

#### Defining the Scripts themselves

As first example let add an initialisation script to our file:

```js
//We hereby declare a new variable init...
let init = P.createScript() //... and affect it a new Script
    .select('all') // we select all motors,
    .speed(150) // and set their speed to 150
    .compliant(false) // at last, we set there compliant state to false
;
```
The first line:
- Creates a new variable named 'init',
- And affects to 'init' a new Script object.

Next lines are call to the 'methods' of Script Object which are fully described in a dedicated [section](###The-Script-Object).

We can also add other scripts to the file:

```js
let toPosition0 = P.createScript()
    .select('all') // Select all motors
    .position(0) // and move all of them to the 0 degree position.
;

let openGrip = P.createScript()
    .select('m6')
    .position(90)
;

let closeGrip = P.createScript()
    .select('m6')
    .position(0)
;

```

#### Executing Scripts

Once scripts defined, their executions is done through the execution engine handled by an object named Poppy:

Adding to your script file:

```js
let poppy = P.createPoppy(); // Instantiate the Poppy object

poppy.exec( // call the execution engine
    init,
    toPosition0,
    openGrip,
    closeGrip,
    end
);
```

and simply typing:

```shell
node ./myScriptFile.js
```
will execute your the scripts.

### The Script Object

This object allows to define a set of actions to apply to target motors.
It allows selecting targeted motors, and then applying them a set of actions.

Such object are created through the factory provided with the poppy-robot-client:

```js
const P = require('poppy-robot-client');

let myScript = P.createScript();
```

It could optionally set the target motors for next actions of the script.

```js
let script = P.createScript('all') // Select all motors
    .compliant(false) // Make them "drivable"
    .speed(100) // Set all motor speed to 100
;

let myOtherScript = P.createScript('m1', 'm3') // Only select the 'm1' and 'm2' motors
    .rotate(30) // rotate 'm1' and 'm3' by 30 degrees.
    .select('m4') // select the 'm4' motor for next action
    .rotate(20) // Rotate 'm4' by 20 degrees
;
```

Once instantiated, Script objects own a bunch of methods in oder to:
- select target motors,
- perform some actions,
- and other basic stuff such as waiting.

Note contrary to the CLI mode, __no controls are performed on input values of these methods and then, it is easy to corrupt motor registries__. Such state will require a reboot of the robot.

The table below resumes the method of the Script object:

name | description
--- | ---
[script.select(...motors)](#scriptselectmotors-%E2%87%92-this) | select the target motors
[script.compliant(value)](#scriptcompliantvalue-%E2%87%92-this) | modify the 'compliant' state of selected motor(s)
[script.speed(value)](#scriptspeedvalue-%E2%87%92-this) | set the speed of selected motor(s)
[script.rotate(value, [wait])](#scriptrotatevalue-wait-%E2%87%92-this) | rotate the selected motor(s) by x degrees
[script.position(value, [wait])](#scriptpositionvalue-wait-%E2%87%92-this) | move the selected motor(s) to a given position.
[script.wait(value)](#scriptwaitvalue-%E2%87%92-this) | the wait function


#### script.select(...motors) ⇒ ```this```

Select the target motor(s) for the next script actions.
It will define the targeted motor(s) until the next __select__ action, if any.

| Param | Type | Description |
| --- | --- | --- |
| ...motors | ```string``` | the selected motor ids or 'all' to select all motors|

**Example:**
```js
let script = P.createScript()
    .select('all') // Select all motors...
    .compliant(false) // Make them "drivable"
    .position(0) // ... move all motors to position 'O' degree.
    . ...        // ... do other nice stuffs (always on all motors)
    . ...
    .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
    .rotate(30) // and apply them a rotation by +30 degrees.
;
```

#### script.compliant(value) ⇒ ```this```

Set the 'compliant' registry of the selected motor(s).

It allows to select the motor state between programmatically "drivable" (false) or
in "rest" mode (true) _i.e._ movable by hand.

| Param | Type | Description |
| --- | --- | --- |
| value | ```boolean``` | __false__ for "drivable" state, __true__ for "rest" mode. |

**Example:**
```js
let script = P.createScript('all')
    .compliant(false)
;
```

#### script.speed(value) ⇒ ```this```

Set the speed (registry 'moving_speed') of the selected motor(s).

| Param | Type | Description |
| --- | --- | --- |
| value | ```integer``` | The speed value. It should be included into the [0,1023] range (speed is conversely to the value) |

**Example:**
```js
let script = P.createScript('all')
    .speed(100)
;
```

#### script.rotate(value, [wait]) ⇒ ```this```

Create an action to rotate the selected motor(s) by x degrees.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | ```integer``` |  | The rotation value |
| [wait] | ```boolean``` | ```true``` | optionally wait that motor(s)      will finish their rotations until executing the next action |

**Example:**
```js
let script = new Script('m1', 'm5')
    .rotate(-30) // Rotate by -30 degrees the selected motors.
                 // It will await all motors finish their rotation)
    .select('m6')
    .rotate(60, false) // It will send an instruction in order to rotate
                       // the motor 'm6' by 60 degrees.
                       // Without awaiting the end of this action, 
                       // the next action will be executed.
    .select('m5')
    .rotate(20)
;
```

#### script.position(value, [wait]) ⇒ ```this```

Set the target position (registry 'goal_position') of the selected
motor(s).

It will create an action which will move the selected motor(s) to a 
given position.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | ```integer``` |  | the position to reach |
| [wait] | ```boolean``` | ```true``` | optionally wait that motor(s) reach(s)      the target position until executing the next action |

**Example:**
```js
let script = P.createScript('all')
    .position(0) // Move all motors to 0 degrees.
                 // It will await all motors reach this position)
    .select('m6')
    .position(90, false) // It will send an instruction 
                         // to Move the motor 'm6' to 90 degrees.
                         // Without awaiting this position is reach, 
                         // the next action will be executed.
    .select('m2')
    .position(-75)
;
```

#### script.led(value) ⇒ ```this```

Set the led value of the target motor(s).

| Param | Type | Description |
| --- | --- | --- |
| value | 'off' \| 'red' \| 'green' \| 'blue' \| 'yellow' \| 'cyan' \| 'pink' \|'white' | value for the 'led' registry |

**Example:**
```js
let script = P.createScript('all')
    .led('blue') // will set the led color to blue
;
```

#### script.wait(value) ⇒ ```this```

The wait method.

| Param | Type | Description |
| --- | --- | --- |
| value | ```integer``` | wait delay (in ms) |


**Example:**
```js
let script = P.createScript()
    .select('m2')
    .position(-90, false) // we do not wait the end of mouvement
    .select('m3')
    .position(90, false) // idem
    .select('m5')
    .position(-90, false) // idem
    .wait(1000) // Wait 1 second
;
```

## Examples

A set of examples script files are located on the so named 'examples' folder.
All these scripts files could be executed to your local computer once the poppy-robot-client globally installed typing:
```shell
node path_to_script_file
```

__basic.js__

A true beginner script introducing to script writing.

__tetris.js__

A more 'real-life' case which demonstrates:
- the sequencing of many scripts,
- the synchronous/asynchronous call of actions.

The default release of this script is in asynchronous mode. Simply editing it and setting the variable named sync to true will set all the motion in synchronous mode.

__XmasTree.js__

The led hell :).
It demonstrates how to (efficiently enough) write scripts in a concise manner.

## API

The poppy-robot-client is mainly based on the following objects:
- The poppy object which handles:
    - The robot configuration and then, the motors objects,
    - The script execution engine.
- The Motor Objects:
    - ExtMotorRequest which handles high level actions of the motors,
    - RawMotorRequest which handles the low-level rest requests to the motor registries through the http server.
- The Script object in order to develop scripts.

The API documentation will coming soon.

## Credits

- Nikolaos Barikipoulos ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

The poppy-robot-client is MIT licensed. See [LICENSE](./LICENSE.md).