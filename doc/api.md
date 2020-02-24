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
     - RawMotorRequest which handles the low-level rest requests to the motor registry.
- The RequestHandlerObject object in charge of all the requests the http server,
- The Script object in order to develop scripts.

Furthermore it exposes a bunch of utility functions such as factories
 for "high-level" objects _i.e._ Script and Poppy ones
 or discovering robot utility, etc...

**Version**: 4.1.0  

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
            * [.setPosition(value, [value])](#module_poppy-robot-core..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.rotate(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.wait(value)](#module_poppy-robot-core..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
            * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
            * [.led(color)](#module_poppy-robot-core..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>
        * [~RawMotorRequest](#module_poppy-robot-core..RawMotorRequest)
            * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-core..RawMotorRequest_new)
            * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
            * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
            * [.led(color)](#module_poppy-robot-core..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>
        * [~PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)
            * [new PoppyRequestHandler([connect])](#new_module_poppy-robot-core..PoppyRequestHandler_new)
            * [.getSettings()](#module_poppy-robot-core..PoppyRequestHandler+getSettings) ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings)
            * [.client([type])](#module_poppy-robot-core..PoppyRequestHandler+client) ⇒ [<code>Axios</code>](#external_Axios)
            * [.setMotorRegister(motorName, registerName, data)](#module_poppy-robot-core..PoppyRequestHandler+setMotorRegister) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.getMotorRegister(motorName, registerName)](#module_poppy-robot-core..PoppyRequestHandler+getMotorRegister) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
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
    httpPort: 8081   // and http server on port 8081
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
| value | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> | value for the 'led' registry |

**Example**  
```js
let script = P.createScript('all')
   .led('blue') // will set the led color to blue
```
<a name="module_poppy-robot-core..Script+position"></a>

#### script.position(value, [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the target position (registry 'goal_position') of the selected motor(s).

It will create an action which will move the selected motor(s) to a given position.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the position to reach in degree |
| [wait] | <code>boolean</code> | <code>true</code> | optionally wait that motor(s) reach(s)    the target position until executing the next action |

**Example**  
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
```
<a name="module_poppy-robot-core..Script+rotate"></a>

#### script.rotate(value, [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Create an action to rotate the selected motor(s) by x degrees.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the rotation value, in degrees |
| [wait] | <code>boolean</code> | <code>true</code> | optionally wait that motor(s) will finish    their rotations until executing the next action |

**Example**  
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
```
<a name="module_poppy-robot-core..Script+speed"></a>

#### script.speed(value) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the speed (registry 'moving_speed') of the selected motor(s).

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | the speed value. It should be included into    the [0,1023] range (speed is conversely to the value) |

**Example**  
```js
let script = P.createScript('all')
   .speed(100) // Set the speed of all motor to 100
```
<a name="module_poppy-robot-core..Script+compliant"></a>

#### script.compliant(value) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the 'compliant' registry of the selected motor(s).
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

It mainly dedicated to wait the end of asynchronous actions.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | wait delay (in ms) |

**Example**  
```js
let script = P.createScript()
   .select('m2')
   .position(-90, false) // we do not wait the end of movement
   .select('m3')
   .position(90, false) // idem
   .select('m5')
   .position(-90, false) // idem
   .wait(1000) // Wait 1 second
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
    * [.setPosition(value, [value])](#module_poppy-robot-core..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.rotate(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.wait(value)](#module_poppy-robot-core..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
    * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
    * [.led(color)](#module_poppy-robot-core..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>

<a name="module_poppy-robot-core..ExtMotorRequest+setSpeed"></a>

#### extMotorRequest.setSpeed(value) ⇒ <code>Promise.&lt;null&gt;</code>
Set the speed (registry 'moving_speed') of the motor.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | the speed value. It should be included into    the [0,1023] range (speed is conversely to the value) |

<a name="module_poppy-robot-core..ExtMotorRequest+setCompliant"></a>

#### extMotorRequest.setCompliant(value) ⇒ <code>Promise.&lt;null&gt;</code>
Set the 'compliant' registry of the selected motor(s).

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | __false__ for "drivable" state, __true__ for "rest" mode. |

<a name="module_poppy-robot-core..ExtMotorRequest+setPosition"></a>

#### extMotorRequest.setPosition(value, [value]) ⇒ <code>Promise.&lt;null&gt;</code>
Set the target position (registry 'goal_position') of the selected motor(s).

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the position to reach in degree |
| [value] | <code>boolean</code> | <code>false</code> | optionally wait that motor reachs the target position |

<a name="module_poppy-robot-core..ExtMotorRequest+rotate"></a>

#### extMotorRequest.rotate(value, [wait]) ⇒ <code>Promise.&lt;null&gt;</code>
Rotate the selected motor(s) by x degrees.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the rotation value, in degrees |
| [wait] | <code>boolean</code> | <code>true</code> | optionally wait that motor will finish its rotation |

<a name="module_poppy-robot-core..ExtMotorRequest+wait"></a>

#### extMotorRequest.wait(value) ⇒ <code>Promise.&lt;null&gt;</code>
Convinient wiat method

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

Not it must not be used for the led registry
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
<a name="module_poppy-robot-core..RawMotorRequest+led"></a>

#### extMotorRequest.led(color) ⇒ <code>Promise.&lt;null&gt;</code>
Set the led register.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> \| <code>&#x27;white&#x27;</code> | register name |

<a name="module_poppy-robot-core..RawMotorRequest"></a>

### poppy-robot-core~RawMotorRequest
Class that handles the primary requests to a Poppy motor _i.e._ the motor registry accesses.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)  

* [~RawMotorRequest](#module_poppy-robot-core..RawMotorRequest)
    * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-core..RawMotorRequest_new)
    * [.getName()](#module_poppy-robot-core..RawMotorRequest+getName) ⇒ <code>string</code>
    * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
    * [.led(color)](#module_poppy-robot-core..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>

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

Not it must not be used for the led registry
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
<a name="module_poppy-robot-core..RawMotorRequest+led"></a>

#### rawMotorRequest.led(color) ⇒ <code>Promise.&lt;null&gt;</code>
Set the led register.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> \| <code>&#x27;white&#x27;</code> | register name |

<a name="module_poppy-robot-core..PoppyRequestHandler"></a>

### poppy-robot-core~PoppyRequestHandler
Class in charge of the requests to the Poppy Robot.

It allows requesting the rest APIs exposed by both http and snap server
served by the Poppy robot.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  

* [~PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)
    * [new PoppyRequestHandler([connect])](#new_module_poppy-robot-core..PoppyRequestHandler_new)
    * [.getSettings()](#module_poppy-robot-core..PoppyRequestHandler+getSettings) ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings)
    * [.client([type])](#module_poppy-robot-core..PoppyRequestHandler+client) ⇒ [<code>Axios</code>](#external_Axios)
    * [.setMotorRegister(motorName, registerName, data)](#module_poppy-robot-core..PoppyRequestHandler+setMotorRegister) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.getMotorRegister(motorName, registerName)](#module_poppy-robot-core..PoppyRequestHandler+getMotorRegister) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
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

 let req = new ReqHandler() // Default settings _i.e._ a Poppy Ergo Jr
 // with hostname and http port respectively set to 'poppy.local' and 8080.

 req = reg.setMotorRegister('m1', 'moving_speed', '100') // will
 // set the 'moving_speed' register of motor 'm1' to 100.

 //...

 req.getMotorRegister('m1', 'present_position') // will return
 // a promise with result as:
 // {'present_position': 15}
```
<a name="module_poppy-robot-core..PoppyRequestHandler+getSettings"></a>

#### poppyRequestHandler.getSettings() ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-core..ConnectionSettings)
Return an object including the connection settings

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
<a name="module_poppy-robot-core..PoppyRequestHandler+client"></a>

#### poppyRequestHandler.client([type]) ⇒ [<code>Axios</code>](#external_Axios)
Return the axios client for either http or snap rest api served
by the robot.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [type] | <code>&#x27;http&#x27;</code> \| <code>&#x27;snap&#x27;</code> | <code>&#x27;http&#x27;</code> | Client selector |

<a name="module_poppy-robot-core..PoppyRequestHandler+setMotorRegister"></a>

#### poppyRequestHandler.setMotorRegister(motorName, registerName, data) ⇒ <code>Promise.&lt;null&gt;</code>
Set a register of a given motor with a value.

Not it must not be used for the led registry
(see dedicated method.)

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| motorName | <code>string</code> | motor name/id |
| registerName | <code>string</code> | register name |
| data | <code>string</code> | **data as string** |

<a name="module_poppy-robot-core..PoppyRequestHandler+getMotorRegister"></a>

#### poppyRequestHandler.getMotorRegister(motorName, registerName) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
Get value of a given register for a given motor.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| motorName | <code>string</code> | motor name/id |
| registerName | <code>string</code> | register name |

**Example**  
```js
const ReqHandler = require('poppy-robot-core').PoppyRequestHandler

 let req = new ReqHandler()

 req.getMotorRegister('m1', 'present_position')
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
| [httpPort] | <code>int</code> | <code>8080</code> | port of the http port served by the Poppy robot |
| [snapPort] | <code>int</code> | <code>6969</code> | port of the snap port served by the Poppy robot (used for led) |
| [timeout] | <code>int</code> | <code>1000</code> | request timeout (in ms) |

