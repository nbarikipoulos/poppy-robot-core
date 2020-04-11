# poppy-robot-core API Reference
This module is the main entry point for poppy robot core.
As user facing module, It exports the poppy-robot-core primary
public API and provides convenience accessors to certain sub-modules.

The poppy-robot-core is mainly based on the following objects:
- The Poppy object which handles:
     - The robot configuration and then, the motors objects,
     - The script execution engine.
- The Motor Objects:
     - ExtMotorRequest which handles high level actions of the motors,
     - RawMotorRequest which handles the low-level rest requests to the motor registers.
- The RequestHandlerObject object in charge of all the requests the REST API,
- The Script object in order to develop scripts.

Furthermore it exposes a bunch of utility functions such as factories
 for "high-level" objects _i.e._ Script and Poppy ones
 or discovering robot utility, etc...

**Version**: 7.0.0  

* [poppy-robot-core](#module_poppy-robot-core)
    * _static_
        * [.createPoppy([config])](#module_poppy-robot-core.createPoppy) ⇒ [<code>Promise.&lt;Poppy&gt;</code>](#module_poppy-robot-core..Poppy)
        * [.createScript([...motorId])](#module_poppy-robot-core.createScript) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
        * [.createDescriptor(locator, [connect])](#module_poppy-robot-core.createDescriptor) ⇒ [<code>Promise.&lt;Descriptor&gt;</code>](#module_poppy-robot-core..Descriptor)
    * _inner_
        * [~Poppy](#module_poppy-robot-core..Poppy)
            * [new Poppy(descriptor, [connect])](#new_module_poppy-robot-core..Poppy_new)
            * [.getDescriptor()](#module_poppy-robot-core..Poppy+getDescriptor) ⇒ <code>Object</code>
            * [.getAllMotorIds()](#module_poppy-robot-core..Poppy+getAllMotorIds) ⇒ <code>Array.&lt;string&gt;</code>
            * [.getMotor(id)](#module_poppy-robot-core..Poppy+getMotor) ⇒ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
            * [.query(motorIds, registers)](#module_poppy-robot-core..Poppy+query) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.exec(...scripts)](#module_poppy-robot-core..Poppy+exec) ⇒ <code>Promise.&lt;null&gt;</code>
        * [~Script](#module_poppy-robot-core..Script)
            * [new Script(...motorIds)](#new_module_poppy-robot-core..Script_new)
            * [.select(...motorId)](#module_poppy-robot-core..Script+select) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.led(value)](#module_poppy-robot-core..Script+led) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.position(value, [wait])](#module_poppy-robot-core..Script+position) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.rotate(value, [wait])](#module_poppy-robot-core..Script+rotate) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.speed(value)](#module_poppy-robot-core..Script+speed) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.compliant(value)](#module_poppy-robot-core..Script+compliant) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.wait(value)](#module_poppy-robot-core..Script+wait) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
        * [~ScriptEngine](#module_poppy-robot-core..ScriptEngine)
            * [.exec(...scripts)](#module_poppy-robot-core..ScriptEngine+exec) ⇒ <code>Promise.&lt;null&gt;</code>
        * [~ExtMotorRequest](#module_poppy-robot-core..ExtMotorRequest) ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
            * [.setSpeed(value)](#module_poppy-robot-core..ExtMotorRequest+setSpeed) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.setCompliant(value)](#module_poppy-robot-core..ExtMotorRequest+setCompliant) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.setLed(color)](#module_poppy-robot-core..ExtMotorRequest+setLed)
            * [.setPosition(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.rotate(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.wait(value)](#module_poppy-robot-core..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
            * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
        * [~RawMotorRequest](#module_poppy-robot-core..RawMotorRequest)
            * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-core..RawMotorRequest_new)
            * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
            * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
        * [~PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)
            * [new PoppyRequestHandler([connect])](#new_module_poppy-robot-core..PoppyRequestHandler_new)
            * [.getSettings()](#module_poppy-robot-core..PoppyRequestHandler+getSettings) ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings)
            * [.perform(url, [method], [config])](#module_poppy-robot-core..PoppyRequestHandler+perform) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.setRegister(motorName, registerName, value)](#module_poppy-robot-core..PoppyRequestHandler+setRegister) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.getRegister(motorName, registerName)](#module_poppy-robot-core..PoppyRequestHandler+getRegister) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
            * [.getAliases()](#module_poppy-robot-core..PoppyRequestHandler+getAliases) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
            * [.getAliasMotors(alias)](#module_poppy-robot-core..PoppyRequestHandler+getAliasMotors) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
        * _Typedefs_
            * [~MotorDescriptor](#module_poppy-robot-core..MotorDescriptor) : <code>Object</code>
            * [~ResponseObject](#module_poppy-robot-core..ResponseObject) : <code>Object</code>
            * [~Descriptor](#module_poppy-robot-core..Descriptor) : <code>Object</code>
            * [~DescriptorLocator](#module_poppy-robot-core..DescriptorLocator) : <code>string</code>
            * [~ConnectionSettings](#module_poppy-robot-core..ConnectionSettings) : <code>Object</code>

<a name="module_poppy-robot-core.createPoppy"></a>

### P.createPoppy([config]) ⇒ [<code>Promise.&lt;Poppy&gt;</code>](#module_poppy-robot-core..Poppy)
Factory that creates the main module object: the Poppy one.
Note It firstly discovers target robot structure using provided connection settings and then
instantiate a new Poppy Object.
Note instantitating a poppy object without any settings will use default one for a poppy ergo jr,

**Kind**: static method of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [Poppy](#module_poppy-robot-core..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | settings object |
| [config.connect] | [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings) | Connection Settings to Poppy |
| [config.locator] | [<code>DescriptorLocator</code>](#module_poppy-robot-core..DescriptorLocator) | Descriptor locator (for advanced users only) |

**Example**  
```js
const P = require('poppy-robot-core')

// create a poppy object using live discovering
// using default connection settings aka poppy.local and port 8080
P.createPoppy().then(poppy => {
 ... // Nice stuff with my poppy
})

// Another Poppy with custom connection settings
const connect = {
    ip: 'poppy1.local' // hostname set to poppy1.local
    port: 8081   // and REST API served on port 8081
}
P.createPoppy({connect}).then(poppy => {
 ... // Other nice stuff with this other poppy
})
```
<a name="module_poppy-robot-core.createScript"></a>

### P.createScript([...motorId]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Convinient factory in order to create a new Poppy Script Object.
It optionally allows selecting a bunch of motor (identified by their names) or
all motors to apply to next actions until call to the select method, if any.

**Kind**: static method of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [Script](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| [...motorId] | <code>string</code> | the motor id/name or 'all' to select all motors |

**Example**  
```js
const P = require('poppy-robot-core')

// Instantiate a new script and automatically target all motors
let myScript = P.createScript('all')

// It is equivalent to
let myOtherScript = P.createScript()
  .select('all')

// Create another script selecting only motor 'm1' and 'm2'
let anotherScript = P.createScript('m1','m2')
```
<a name="module_poppy-robot-core.createDescriptor"></a>

### P.createDescriptor(locator, [connect]) ⇒ [<code>Promise.&lt;Descriptor&gt;</code>](#module_poppy-robot-core..Descriptor)
Create a Poppy motor configuration object aka descriptor that contains:
- The list of motors,
- The name and angle range of each motors,
- At last the aliases _i.e._ set/group of motors

It allows creating a Descriptor:
 - Performing a live discovering from connected robot,
 - From either an internal or provided by user json file.

The connect options are only used for live discovering.

**Kind**: static method of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [DescriptorLocator](#module_poppy-robot-core..DescriptorLocator)  

| Param | Type | Description |
| --- | --- | --- |
| locator | [<code>DescriptorLocator</code>](#module_poppy-robot-core..DescriptorLocator) | The descriptor locator. Set to 'desc://live-discovering' if undefined or null. |
| [connect] | [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings) | connection settings. If not provided, default [ConnectionSettings](#module_poppy-robot-core..ConnectionSettings) will be used |

<a name="module_poppy-robot-core..Poppy"></a>

### poppy-robot-core~Poppy
The main object of the module.
The poppy object handles:
- The robot descriptor aka the aliases and motors configuration,
- The object in charge of the requests to the robot,
- At last the script execution engine.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  

* [~Poppy](#module_poppy-robot-core..Poppy)
    * [new Poppy(descriptor, [connect])](#new_module_poppy-robot-core..Poppy_new)
    * [.getDescriptor()](#module_poppy-robot-core..Poppy+getDescriptor) ⇒ <code>Object</code>
    * [.getAllMotorIds()](#module_poppy-robot-core..Poppy+getAllMotorIds) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getMotor(id)](#module_poppy-robot-core..Poppy+getMotor) ⇒ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
    * [.query(motorIds, registers)](#module_poppy-robot-core..Poppy+query) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.exec(...scripts)](#module_poppy-robot-core..Poppy+exec) ⇒ <code>Promise.&lt;null&gt;</code>

<a name="new_module_poppy-robot-core..Poppy_new"></a>

#### new Poppy(descriptor, [connect])
Instantiate a new Poppy object.

Note Intantitating a poppy object without any settings will use ones
for a Poppy Ergo Jr,


| Param | Type | Description |
| --- | --- | --- |
| descriptor | [<code>Descriptor</code>](#module_poppy-robot-core..Descriptor) | Robot descriptor |
| [connect] | [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings) | Connection Settings to Poppy |

**Example**  
```js
const Poppy = require('poppy-robot-core').Poppy
const factory = require('poppy-robot-core/utils/descriptorFactory')
//
// create a poppy object using default connection settings
//
const desc = factory.create()
const poppy = new Poppy(desc)

//
// Let get another robot with with poppy1.local as hostname
// and let discover it lively.
//
const connect = { ip: poppy1.local }
const desc1 = factory.create(connect)
const anotherPoppy = new Poppy(desc1, connect)
```
<a name="module_poppy-robot-core..Poppy+getDescriptor"></a>

#### poppy.getDescriptor() ⇒ <code>Object</code>
Accessor to the robot descriptor handled by this instance/

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  
<a name="module_poppy-robot-core..Poppy+getAllMotorIds"></a>

#### poppy.getAllMotorIds() ⇒ <code>Array.&lt;string&gt;</code>
Return a list containing all registered motor names/ids for this instance.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  
<a name="module_poppy-robot-core..Poppy+getMotor"></a>

#### poppy.getMotor(id) ⇒ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
Accessor on the motor Object named/with id 'id'.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | motor name/id |

<a name="module_poppy-robot-core..Poppy+query"></a>

#### poppy.query(motorIds, registers) ⇒ <code>Promise.&lt;Object&gt;</code>
Convinient method to query register(s) of all or a set of registered motors.
It returns an object with properties named with to the motor name
and set to the [ResponseObject](#module_poppy-robot-core..PoppyRequestHandler) which contains the queried register values.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  
**See**: [ResponseObject](#module_poppy-robot-core..ResponseObject)  

| Param | Type | Description |
| --- | --- | --- |
| motorIds | <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> | target motor name(s)/id(s) |
| registers | <code>Array.&lt;string&gt;</code> | target registers |

**Example**  
```js
const Poppy = require('poppy-robot-core').Poppy

const poppy = new Poppy()

poppy.query(['m1', 'm2'], ['present_position', 'goal_position'])
// Will return a promise with result as
// {
//   m1: {present_position: 10, goal_position: 80},
//   m2: {present_position: 0, goal_position: -90},
//}
```
<a name="module_poppy-robot-core..Poppy+exec"></a>

#### poppy.exec(...scripts) ⇒ <code>Promise.&lt;null&gt;</code>
Execute Scripts.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| ...scripts | [<code>Script</code>](#module_poppy-robot-core..Script) | The scripts to execute |

<a name="module_poppy-robot-core..Script"></a>

### poppy-robot-core~Script
This object allows defining a set of actions to apply to target motors.
It allows selecting targeted motors, and then applying them a set of actions.

Once instantiated, Script objects own a bunch of methods in oder to:
- select target motors,
- perform some actions,
- and other basic stuff such as waiting.

Note contrary to the CLI mode, __no controls are performed on input values of
these methods and then, it is easy to corrupt motor registries__.
Such state will require a reboot of the robot.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  

* [~Script](#module_poppy-robot-core..Script)
    * [new Script(...motorIds)](#new_module_poppy-robot-core..Script_new)
    * [.select(...motorId)](#module_poppy-robot-core..Script+select) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.led(value)](#module_poppy-robot-core..Script+led) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.position(value, [wait])](#module_poppy-robot-core..Script+position) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.rotate(value, [wait])](#module_poppy-robot-core..Script+rotate) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.speed(value)](#module_poppy-robot-core..Script+speed) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.compliant(value)](#module_poppy-robot-core..Script+compliant) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.wait(value)](#module_poppy-robot-core..Script+wait) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)

<a name="new_module_poppy-robot-core..Script_new"></a>

#### new Script(...motorIds)
Create a new Script Object.

It could optionally set the targeted motor for the next actions of
this script.


| Param | Type | Description |
| --- | --- | --- |
| ...motorIds | <code>string</code> | the motor id/name or 'all' to select all motors |

**Example**  
```js
const Script = require('poppy-robot-core').Script

let script = new Script('all') // Select all motors
  .compliant(false) // Make them "drivable"
  .speed(100) // Set all motor speed to 100

let myOtherScript = new Script('m1', 'm3') // Only select the 'm1' and 'm2' motors
  .rotate(30) // rotate 'm1' and 'm3' by 30 degrees.
  .select('m4') // select the 'm4' motor for next action
  .rotate(20) // Rotate 'm4' by 20 degrees
```
<a name="module_poppy-robot-core..Script+select"></a>

#### script.select(...motorId) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Select the target motor(s) for the next script actions.
It will define the targeted motor(s) until the next __select__ action, if any.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| ...motorId | <code>string</code> | the id (_i.e._ name) of the selected motor or 'all' to select all motors |

**Example**  
```js
let script = P.createScript()
   .select('all') // Select all motors...
   .compliant(false) // Make them "drivable"
   .position(0) // ... move all motors to position 'O' degree.
   . ...        // ... do other nice stuffs (always on all motors)
   . ...
   .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
   .rotate(30) // and apply them a rotation by +30 degrees.
```
<a name="module_poppy-robot-core..Script+led"></a>

#### script.led(value) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the led value of the target motor(s).

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> | value for the 'led' register |

**Example**  
```js
let script = P.createScript('all')
   .led('blue') // will set the led color to blue
```
<a name="module_poppy-robot-core..Script+position"></a>

#### script.position(value, [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the target position (register 'goal_position') of the selected motor(s).

It will create an action which will move the selected motor(s) to a given position.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the position to reach in degree |
| [wait] | <code>boolean</code> | <code>false</code> | wait until motors reach their target positions. |

**Example**  
```js
let script = P.createScript('m6')
   .position(90) // Send a request in order to "open" the grip.
                 // It does not wait the end of this movement
                 // and next instructions will be send in the wake of it
   .select('m1', 'm2', 'm3', 'm4')
   .position(0, true) // Send a instruction to move all selected motors to 0 sequentially.
                      // i.e. for each motor, it awaits the end of the movement,
                      // and then does the same for the next selected motor.
```
<a name="module_poppy-robot-core..Script+rotate"></a>

#### script.rotate(value, [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Create an action to rotate the selected motor(s) by x degrees.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the rotation value, in degrees |
| [wait] | <code>boolean</code> | <code>false</code> | wait until the selected motors will end rotating    before executing the next action |

**Example**  
```js
let script = new Script('m1', 'm5')
   .rotate(-30) // Send instruction to rotate by -30 degrees the selected motors.
                // It does not wait the end of this movement
                // and next instructions will be send in the wake of it
   .select('m6')
   .rotate(60, true) // Send an instruction in order to rotate
                     // the motor 'm6' by 60 degrees and await the end of the movement
   .select('m6')
   .rotate(-60, true)
```
<a name="module_poppy-robot-core..Script+speed"></a>

#### script.speed(value) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the speed (register 'moving_speed') of the selected motor(s).

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | the speed value. It should be included into    the [0,1023] range (speed is more or less 0.666 degree.s-1 per unit).    Note using 0 set the speed to the highest possible value. |

**Example**  
```js
let script = P.createScript('all')
   .speed(100) // Set the speed of all motor to 100
```
<a name="module_poppy-robot-core..Script+compliant"></a>

#### script.compliant(value) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the 'compliant' register of the selected motor(s).
It allows to select the motor state between programmatically "drivable" (false)
 or in "rest" mode (true) _i.e._ movable by hand.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | __false__ for "drivable" state, __true__ for "rest" mode. |

**Example**  
```js
let script = P.createScript('all')
   .compliant(false)
```
<a name="module_poppy-robot-core..Script+wait"></a>

#### script.wait(value) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
The wait method. It allows to stop the script execution during a given
delay.

It mainly dedicated to wait the end of actions "simultaneously" executed.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | wait delay (in ms) |

**Example**  
```js
let script = P.createScript()
   .select('m2')
   .position(-90) // we do not wait the end of movement
   .select('m3')
   .position(90) // idem
   .select('m5')
   .position(-90) // idem
   .wait(1000) // Wait 1 second before next actions
```
<a name="module_poppy-robot-core..ScriptEngine"></a>

### poppy-robot-core~ScriptEngine
Script execution engine.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
<a name="module_poppy-robot-core..ScriptEngine+exec"></a>

#### scriptEngine.exec(...scripts) ⇒ <code>Promise.&lt;null&gt;</code>
Execute Scripts.

**Kind**: instance method of [<code>ScriptEngine</code>](#module_poppy-robot-core..ScriptEngine)  

| Param | Type | Description |
| --- | --- | --- |
| ...scripts | [<code>Script</code>](#module_poppy-robot-core..Script) | The scripts to execute |

<a name="module_poppy-robot-core..ExtMotorRequest"></a>

### poppy-robot-core~ExtMotorRequest ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
Class representing a Poppy Motor which handles both low-level and
high-level actions on Poppy motor.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Extends**: [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

* [~ExtMotorRequest](#module_poppy-robot-core..ExtMotorRequest) ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
    * [.setSpeed(value)](#module_poppy-robot-core..ExtMotorRequest+setSpeed) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.setCompliant(value)](#module_poppy-robot-core..ExtMotorRequest+setCompliant) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.setLed(color)](#module_poppy-robot-core..ExtMotorRequest+setLed)
    * [.setPosition(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.rotate(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.wait(value)](#module_poppy-robot-core..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
    * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)

<a name="module_poppy-robot-core..ExtMotorRequest+setSpeed"></a>

#### extMotorRequest.setSpeed(value) ⇒ <code>Promise.&lt;null&gt;</code>
Set the speed (register 'moving_speed') of the motor.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | the speed value. It should be included into    the [0,1023] range (speed is more or less 0.666 degree.s-1 per unit)    Note using 0 set the speed to the highest possible value. |

<a name="module_poppy-robot-core..ExtMotorRequest+setCompliant"></a>

#### extMotorRequest.setCompliant(value) ⇒ <code>Promise.&lt;null&gt;</code>
Set the 'compliant' register of the motor.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | __false__ for "drivable" state, __true__ for "rest" mode. |

<a name="module_poppy-robot-core..ExtMotorRequest+setLed"></a>

#### extMotorRequest.setLed(color)
Set the led register.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> \| <code>&#x27;white&#x27;</code> | Led color value |

<a name="module_poppy-robot-core..ExtMotorRequest+setPosition"></a>

#### extMotorRequest.setPosition(value, [wait]) ⇒ <code>Promise.&lt;null&gt;</code>
Set the target position (register 'goal_position') of the selected motor(s).

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the position to reach in degree |
| [wait] | <code>boolean</code> | <code>false</code> | wait until the motor reachs the target position |

<a name="module_poppy-robot-core..ExtMotorRequest+rotate"></a>

#### extMotorRequest.rotate(value, [wait]) ⇒ <code>Promise.&lt;null&gt;</code>
Rotate the selected motor(s) by x degrees.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the rotation value, in degrees |
| [wait] | <code>boolean</code> | <code>false</code> | wait until the motor ends its rotation |

<a name="module_poppy-robot-core..ExtMotorRequest+wait"></a>

#### extMotorRequest.wait(value) ⇒ <code>Promise.&lt;null&gt;</code>
Convinient wait method

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | wait delay (in ms) |

<a name="module_poppy-robot-core..RawMotorRequest+getName"></a>

#### extMotorRequest.getName() ⇒ <code>string</code>
Get the motor name/id.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  
<a name="module_poppy-robot-core..RawMotorRequest+set"></a>

#### extMotorRequest.set(registerName, data) ⇒ <code>Promise.&lt;null&gt;</code>
Set a register of the motor to a given value.

Not it must not be used for the led register
(see dedicated method.)

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| registerName | <code>string</code> | register name |
| data | <code>string</code> | data as string |

<a name="module_poppy-robot-core..RawMotorRequest+get"></a>

#### extMotorRequest.get(...registerNames) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
Get value of target register(s).

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| ...registerNames | <code>string</code> | target register names |

**Example**  
```js
const P = require('poppy-robot-core'),
 RawMotor = P.RawMotorRequest,
 ReqHandler = P.PoppyRequestHandler

let motor = new RawMotor(
 { name: 'm1', lower_limit: -90, upper_limit: 90},
 new ReqHandler() // default setting to Poppy Ergo Jr
})

motor.get('present_position', 'goal_position')
// Will return a promise with result as
// {
//   present_position: 10,
//   goal_position: 80
// }
```
<a name="module_poppy-robot-core..RawMotorRequest"></a>

### poppy-robot-core~RawMotorRequest
Class that handles the primary requests to a Poppy motor _i.e._ the motor register accesses.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)  

* [~RawMotorRequest](#module_poppy-robot-core..RawMotorRequest)
    * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-core..RawMotorRequest_new)
    * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
    * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)

<a name="new_module_poppy-robot-core..RawMotorRequest_new"></a>

#### new RawMotorRequest(motor, requestHandler)
Instantiate a new raw motor object.


| Param | Type | Description |
| --- | --- | --- |
| motor | [<code>MotorDescriptor</code>](#module_poppy-robot-core..MotorDescriptor) | motor descriptor |
| requestHandler | [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler) | Poppy request handler object |

**Example**  
```js
const P = require('poppy-robot-core'),
 RawMotor = P.RawMotorRequest,
 ReqHandler = P.PoppyRequestHandler

let motor = new RawMotor(
  { name: 'm1', lower_limit: -90, upper_limit: 90},
  new ReqHandler() // default setting to Poppy Ergo Jr
)

motor.set('moving_speed', '100') // Will set the speed to 100,

//...

motor.get('moving_speed') // Will return a promise with result as
// {
//   moving_speed: 100
// }
```
<a name="module_poppy-robot-core..RawMotorRequest+getName"></a>

#### rawMotorRequest.getName() ⇒ <code>string</code>
Get the motor name/id.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  
<a name="module_poppy-robot-core..RawMotorRequest+set"></a>

#### rawMotorRequest.set(registerName, data) ⇒ <code>Promise.&lt;null&gt;</code>
Set a register of the motor to a given value.

Not it must not be used for the led register
(see dedicated method.)

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| registerName | <code>string</code> | register name |
| data | <code>string</code> | data as string |

<a name="module_poppy-robot-core..RawMotorRequest+get"></a>

#### rawMotorRequest.get(...registerNames) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
Get value of target register(s).

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| ...registerNames | <code>string</code> | target register names |

**Example**  
```js
const P = require('poppy-robot-core'),
 RawMotor = P.RawMotorRequest,
 ReqHandler = P.PoppyRequestHandler

let motor = new RawMotor(
 { name: 'm1', lower_limit: -90, upper_limit: 90},
 new ReqHandler() // default setting to Poppy Ergo Jr
})

motor.get('present_position', 'goal_position')
// Will return a promise with result as
// {
//   present_position: 10,
//   goal_position: 80
// }
```
<a name="module_poppy-robot-core..PoppyRequestHandler"></a>

### poppy-robot-core~PoppyRequestHandler
Class in charge of the requests to the Poppy Robot.

It allows requesting the REST API exposed by the http server located on
the Robot.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  

* [~PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)
    * [new PoppyRequestHandler([connect])](#new_module_poppy-robot-core..PoppyRequestHandler_new)
    * [.getSettings()](#module_poppy-robot-core..PoppyRequestHandler+getSettings) ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings)
    * [.perform(url, [method], [config])](#module_poppy-robot-core..PoppyRequestHandler+perform) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.setRegister(motorName, registerName, value)](#module_poppy-robot-core..PoppyRequestHandler+setRegister) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getRegister(motorName, registerName)](#module_poppy-robot-core..PoppyRequestHandler+getRegister) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
    * [.getAliases()](#module_poppy-robot-core..PoppyRequestHandler+getAliases) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.getAliasMotors(alias)](#module_poppy-robot-core..PoppyRequestHandler+getAliasMotors) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>

<a name="new_module_poppy-robot-core..PoppyRequestHandler_new"></a>

#### new PoppyRequestHandler([connect])
Instantiate a new Poppy Request Handler.

Default instantiation will use the default poppy ergo jr connection
settings.


| Param | Type | Description |
| --- | --- | --- |
| [connect] | [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings) | connection settings |

**Example**  
```js
const ReqHandler = require('poppy-robot-core').PoppyRequestHandler

 const connect = {
   ip: 'poppy.home',
   port: 8081
 }

 let req = new ReqHandler(connect)

 // set the 'moving_speed' register of the motor 'm1' to 100.
 reg.setRegister('m1', 'moving_speed', '100')

 //...

 // get current position of the motor 'm1'
 // will return a promise with result as: {'present_position': 15}
 req.getRegister('m1', 'present_position')
```
<a name="module_poppy-robot-core..PoppyRequestHandler+getSettings"></a>

#### poppyRequestHandler.getSettings() ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings)
Return the connection settings

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
<a name="module_poppy-robot-core..PoppyRequestHandler+perform"></a>

#### poppyRequestHandler.perform(url, [method], [config]) ⇒ <code>Promise.&lt;Object&gt;</code>
Convinient method performing request to the robot.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Axios Response schema object  
**See**: https://github.com/axios/axios  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  | relative or absolute url to REST API served by the http server. |
| [method] | <code>string</code> | <code>&quot;&#x27;get&#x27;&quot;</code> | request method to be used when making the request |
| [config] | <code>Object</code> |  | extra axios client settings |

**Example**  
```js
const ReqHandler = require('poppy-robot-core').PoppyRequestHandler

 const req = new ReqHandler({ ip: 'poppy.home' })

// Get: get the list the registers of the motor 'm1'
 req.perform('/motor/m1/register/list.json').then(response => {
   const list = response.data
   // ...
 })

 // Post request: set the 'compliant' register
 req.perform(
   '/motor/m1/register/compliant/value.json',
   { method: 'post', config: { data: 'false' } }
 ).catch(err => { console.log(err) })
```
<a name="module_poppy-robot-core..PoppyRequestHandler+setRegister"></a>

#### poppyRequestHandler.setRegister(motorName, registerName, value) ⇒ <code>Promise.&lt;Object&gt;</code>
Set the value of a register of a motor.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Axios Response schema object  

| Param | Type | Description |
| --- | --- | --- |
| motorName | <code>string</code> | motor name/id |
| registerName | <code>string</code> | register name |
| value | <code>\*</code> | value to post |

<a name="module_poppy-robot-core..PoppyRequestHandler+getRegister"></a>

#### poppyRequestHandler.getRegister(motorName, registerName) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
Get the value of a register.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| motorName | <code>string</code> | motor name/id |
| registerName | <code>string</code> | register name |

**Example**  
```js
const ReqHandler = require('poppy-robot-core').PoppyRequestHandler

 let req = new ReqHandler()

 req.getRegister('m1', 'present_position')
 // will return
 // a promise with result as:
 // {'present_position': 15}
```
<a name="module_poppy-robot-core..PoppyRequestHandler+getAliases"></a>

#### poppyRequestHandler.getAliases() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get the aliases of the Poppy Robot.

Return an array containing the alias name/ids.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
<a name="module_poppy-robot-core..PoppyRequestHandler+getAliasMotors"></a>

#### poppyRequestHandler.getAliasMotors(alias) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get the motor of a given alias.

Return an array that contains the motor name/ids.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>string</code> | alias name/id |

<a name="module_poppy-robot-core..MotorDescriptor"></a>

### poppy-robot-core~MotorDescriptor : <code>Object</code>
Motor Descriptor.

**Kind**: inner typedef of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name/id of the motor |
| lower_limit | <code>int</code> | lower angle boundary of the motor |
| upper_limit | <code>int</code> | upper angle boundary of the motor |

<a name="module_poppy-robot-core..ResponseObject"></a>

### poppy-robot-core~ResponseObject : <code>Object</code>
Response object that handles result of requests to the pypot http server
embedded in poppy Robot.

This object is composed of properties with names and values
respectively set with the register name and the returned value.
More details available [here](https://github.com/poppy-project/pypot/blob/master/REST-APIs.md)
about the REST API of the pypot http server.

**Kind**: inner typedef of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| `$registerName` | <code>string</code> \| <code>integer</code> \| <code>boolean</code> | a property set to the queried register. |

<a name="module_poppy-robot-core..Descriptor"></a>

### poppy-robot-core~Descriptor : <code>Object</code>
Poppy robot descriptor.

It handles the "structure" of motors of the target Poppy.
it gathers data about:
- alias _i.e._ set of motors,
- motor: name/id as well as angle range.

And other descriptive data.

**Kind**: inner typedef of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [description] | <code>string</code> | a human readable text about this descriptor |
| name | <code>string</code> | name/id of this descriptor |
| aliases | <code>Array.&lt;{name: string, motors: Array.&lt;string&gt;}&gt;</code> | list of aliases |
| motors | [<code>Array.&lt;MotorDescriptor&gt;</code>](#module_poppy-robot-core..MotorDescriptor) | the motor "descriptors" |

<a name="module_poppy-robot-core..DescriptorLocator"></a>

### poppy-robot-core~DescriptorLocator : <code>string</code>
A String to locate a Poppy descriptor whith a format inspired by the URI one: 'schema://path'

**Kind**: inner typedef of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| schema | <code>&#x27;file&#x27;</code> \| <code>&#x27;desc&#x27;</code> | 'file' to refer to a local descriptor          'desc' to refer to an inner descriptor of the module |
| path | <code>string</code> | 'file' case: absolute or relative path to a local descriptor file,          'desc' case:            - 'live-discovering': live discovering of the Poppy,            - id to an embedded descriptor (only poppy-ergo-jr is nowadays supported) |

**Example**  
```js
let locator = 'file://myPoppy.json' // locator to a local descriptor file named myPoppy.json
let myOtherLocator = 'desc://live-discovering' // locator indicating a live discovrering will be executed
```
<a name="module_poppy-robot-core..ConnectionSettings"></a>

### poppy-robot-core~ConnectionSettings : <code>Object</code>
Connection Settings to Poppy Robot.

**Kind**: inner typedef of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Category**: Typedefs  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [ip] | <code>string</code> | <code>&quot;poppy.local&quot;</code> | hostname/ip of the targeted Poppy robot |
| [port] | <code>int</code> | <code>8080</code> | port of the REST API served by the http server on robot |
| [timeout] | <code>int</code> | <code>1000</code> | request timeout (in ms) |

