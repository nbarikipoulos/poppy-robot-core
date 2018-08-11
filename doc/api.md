# poppy-robot-client API Reference
This module is the main entry point for poppy robot client.
It contains factories for high-level objects of this module
_i.e._ for Poppy and Script Objects.

As user facing module, It exports the poppy-robot-client primary
public API and provides convenience accessors to certain sub-modules.

The poppy-robot-client is mainly based on the following objects:
- The Poppy object which handles:
     - The robot configuration and then, the motors objects,
     - The script execution engine.
- The Motor Objects:
     - ExtMotorRequest which handles high level actions of the motors,
     - RawMotorRequest which handles the low-level rest requests to the motor registry.
- The RequestHandlerObject object in charge of all the requests the http server,
- The Script object in order to develop scripts.

Furthermore, Note it automatically appends a set of optional flags in order to set
the connection to poppy:

option | desc | value | default
--- | --- | --- | --- 
-i/--ip | Set the Poppy IP/hostname | string | poppy.local
-p/--http-port | Set the http server port on Poppy | integer | 8080
-P/--snap-port | Set the snap server port on Poppy | integer | 6969

**Version**: 2.0.0  

* [poppy-robot-client](#module_poppy-robot-client)
    * _static_
        * [.createPoppy([options])](#module_poppy-robot-client.createPoppy) : [<code>Poppy</code>](#module_poppy-robot-client..Poppy)
        * [.createScript([...motorId])](#module_poppy-robot-client.createScript) : [<code>Script</code>](#module_poppy-robot-client..Script)
    * _inner_
        * [~Poppy](#module_poppy-robot-client..Poppy)
            * [new Poppy([options])](#new_module_poppy-robot-client..Poppy_new)
            * [.getConfig()](#module_poppy-robot-client..Poppy+getConfig) ⇒ <code>Object</code>
            * [.getDescriptor()](#module_poppy-robot-client..Poppy+getDescriptor) ⇒ <code>Object</code>
            * [.getAllMotorIds()](#module_poppy-robot-client..Poppy+getAllMotorIds) ⇒ <code>Array.&lt;string&gt;</code>
            * [.getMotor(id)](#module_poppy-robot-client..Poppy+getMotor) ⇒ [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)
            * [.exec(...scripts)](#module_poppy-robot-client..Poppy+exec) ⇒ <code>Promise.&lt;null&gt;</code>
        * [~Script](#module_poppy-robot-client..Script)
            * [new Script(...motorIds)](#new_module_poppy-robot-client..Script_new)
            * [.select(...motorId)](#module_poppy-robot-client..Script+select) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
            * [.led(value)](#module_poppy-robot-client..Script+led) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
            * [.position(value, [wait])](#module_poppy-robot-client..Script+position) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
            * [.rotate(value, [wait])](#module_poppy-robot-client..Script+rotate) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
            * [.speed(value)](#module_poppy-robot-client..Script+speed) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
            * [.compliant(value)](#module_poppy-robot-client..Script+compliant) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
            * [.wait(value)](#module_poppy-robot-client..Script+wait) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
        * [~ExtMotorRequest](#module_poppy-robot-client..ExtMotorRequest) ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)
            * [new ExtMotorRequest(motor, requestHandler)](#new_module_poppy-robot-client..ExtMotorRequest_new)
            * [.setSpeed(value)](#module_poppy-robot-client..ExtMotorRequest+setSpeed) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.setCompliant(value)](#module_poppy-robot-client..ExtMotorRequest+setCompliant) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.setPosition(value, [value])](#module_poppy-robot-client..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.rotate(@param, [wait])](#module_poppy-robot-client..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.wait(value)](#module_poppy-robot-client..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.set(register_name, data)](#module_poppy-robot-client..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(register_name)](#module_poppy-robot-client..RawMotorRequest+get) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
            * [.led(color)](#module_poppy-robot-client..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.getLedValues()](#module_poppy-robot-client..RawMotorRequest+getLedValues) ⇒ <code>Array.&lt;string&gt;</code>
        * [~RawMotorRequest](#module_poppy-robot-client..RawMotorRequest)
            * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-client..RawMotorRequest_new)
            * [.set(register_name, data)](#module_poppy-robot-client..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(register_name)](#module_poppy-robot-client..RawMotorRequest+get) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
            * [.led(color)](#module_poppy-robot-client..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.getLedValues()](#module_poppy-robot-client..RawMotorRequest+getLedValues) ⇒ <code>Array.&lt;string&gt;</code>
        * [~PoppyRequestHandler](#module_poppy-robot-client..PoppyRequestHandler)
            * [new PoppyRequestHandler([connect])](#new_module_poppy-robot-client..PoppyRequestHandler_new)
            * [.getSettings()](#module_poppy-robot-client..PoppyRequestHandler+getSettings) ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-client..ConnectionSettings)
            * [.setMotorRegister(motor_name, register_name, data)](#module_poppy-robot-client..PoppyRequestHandler+setMotorRegister) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.getMotorRegister(motor_name, register_name)](#module_poppy-robot-client..PoppyRequestHandler+getMotorRegister) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
            * [.getAliases()](#module_poppy-robot-client..PoppyRequestHandler+getAliases) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
            * [.getAliasMotors(alias)](#module_poppy-robot-client..PoppyRequestHandler+getAliasMotors) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
        * _Typedefs_
            * [~MotorDescriptor](#module_poppy-robot-client..MotorDescriptor) : <code>Object</code>
            * [~ConnectionSettings](#module_poppy-robot-client..ConnectionSettings) : <code>Object</code>
            * [~ResponseObject](#module_poppy-robot-client..ResponseObject) : <code>Object</code>
            * [~DescriptorLocator](#module_poppy-robot-client..DescriptorLocator) : <code>string</code>

<a name="module_poppy-robot-client.createPoppy"></a>

### P.createPoppy([options]) : [<code>Poppy</code>](#module_poppy-robot-client..Poppy)
Factory which create the main module object: the Poppy one.

As this object is in charge of the connection to the Poppy and
handles the robot configuration, this factory allow modifying these
settings for their particular cases.

Note:
- Intantitating a poppy object without any settings will use ones
by default for a poppy ergo jr,
- This factory automatically reads the settings provided by both the .poppyrc
 file and and CLI options in this order:
     - It first checks if a .poppyrc file exists, and then it reads it,
     - On a second hand, it uses the CLI settings, if any, and then it will override the corresponding values,
     - At last, it will override these settings with values passed through the arguments of this factory.

**Kind**: static method of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**See**: [Poppy](#module_poppy-robot-client..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | settings object |
| [options.descriptor] | [<code>DescriptorLocator</code>](#module_poppy-robot-client..DescriptorLocator) | Descriptor locator (for advanced users only) |
| [options.connect] | [<code>ConnectionSettings</code>](#module_poppy-robot-client..ConnectionSettings) | Connection Settings to Poppy |

**Example**  
```js
const P = require('poppy-robot-client'); 

let poppy = P.createPoppy(); // create a poppy object
                             // using default settings for a Poppy Ergo Jr.

let anotherPoppy = P.createPoppy({ // Another Poppy Ergo Jr...
     connect : { // ...with custom connection settings: 
         ip: poppy1.local // hostname set to poppy1.local
         httpPort: 8081   // and http server on port 8081
     }
});
```
<a name="module_poppy-robot-client.createScript"></a>

### P.createScript([...motorId]) : [<code>Script</code>](#module_poppy-robot-client..Script)
Convinient factory in order to create a new Poppy Script Object.
It optionally allows selecting a bunch of motor (identified by their names) or
all motors to apply to next actions until call to select method, if any.

**Kind**: static method of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**See**: [Script](#module_poppy-robot-client..Script)  

| Param | Type | Description |
| --- | --- | --- |
| [...motorId] | <code>string</code> | the motor id/name or 'all' to select all motors |

**Example**  
```js
const P = require('poppy-robot-client');

// Instantiate a new script and automatically target all motors
let myScript = P.createScript('all');

// It is equivalent to
let myOtherScript = P.createScript()
    .select('all')
;

// Create another script selecting only motor 'm1' and 'm2'
let anotherScript = P.createScript('m1','m2');
```
<a name="module_poppy-robot-client..Poppy"></a>

### poppy-robot-client~Poppy
The main object of the module.
The poppy object handles:
- The robot descriptor aka the aliases and motors configuration,
- The requesting object to the robot,
- At last the script execution engine.

Note contrary to instantiating through the factory P.createPoppy, it does not automatically
take into account settings of the .poppyrc file or passed through the CLI

**Kind**: inner class of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  

* [~Poppy](#module_poppy-robot-client..Poppy)
    * [new Poppy([options])](#new_module_poppy-robot-client..Poppy_new)
    * [.getConfig()](#module_poppy-robot-client..Poppy+getConfig) ⇒ <code>Object</code>
    * [.getDescriptor()](#module_poppy-robot-client..Poppy+getDescriptor) ⇒ <code>Object</code>
    * [.getAllMotorIds()](#module_poppy-robot-client..Poppy+getAllMotorIds) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getMotor(id)](#module_poppy-robot-client..Poppy+getMotor) ⇒ [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)
    * [.exec(...scripts)](#module_poppy-robot-client..Poppy+exec) ⇒ <code>Promise.&lt;null&gt;</code>

<a name="new_module_poppy-robot-client..Poppy_new"></a>

#### new Poppy([options])
Instantiate a new Poppy object.
 Note Intantitating a poppy object without any settings will use ones
by default for a poppy ergo jr,


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | settings object |
| [options.descriptor] | [<code>DescriptorLocator</code>](#module_poppy-robot-client..DescriptorLocator) | Descriptor locator |
| [options.connect] | [<code>ConnectionSettings</code>](#module_poppy-robot-client..ConnectionSettings) | Connection Settings to Poppy |

**Example**  
```js
const Poppy = require('poppy-robot-client').Poppy; 

let poppy = new Poppy(); // create a poppy object
                             // using default settings for a Poppy Ergo Jr.

let anotherPoppy = new Poppy({ // Another Poppy Ergo Jr...
     connect : { // ...with custom connection settings: 
         ip: poppy1.local // hostname set to poppy1.local
         httpPort: 8081   // and http server on port 8081
     }
});
```
<a name="module_poppy-robot-client..Poppy+getConfig"></a>

#### poppy.getConfig() ⇒ <code>Object</code>
Accessor config object passed at instantiation __i.e.__
without defaut values

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-client..Poppy)  
<a name="module_poppy-robot-client..Poppy+getDescriptor"></a>

#### poppy.getDescriptor() ⇒ <code>Object</code>
Accessor on the descriptor handled

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-client..Poppy)  
<a name="module_poppy-robot-client..Poppy+getAllMotorIds"></a>

#### poppy.getAllMotorIds() ⇒ <code>Array.&lt;string&gt;</code>
Return a list containing all motor ids

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-client..Poppy)  
<a name="module_poppy-robot-client..Poppy+getMotor"></a>

#### poppy.getMotor(id) ⇒ [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)
Accessor on the motor Object with id 'id'

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-client..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | motor name/id |

<a name="module_poppy-robot-client..Poppy+exec"></a>

#### poppy.exec(...scripts) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Execute Scripts

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-client..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| ...scripts | [<code>Script</code>](#module_poppy-robot-client..Script) | The scripts to execute |

<a name="module_poppy-robot-client..Script"></a>

### poppy-robot-client~Script
This object allows defining a set of actions to apply to target motors.
It allows selecting targeted motors, and then applying them a set of actions.

Once instantiated, Script objects own a bunch of methods in oder to:
- select target motors,
- perform some actions,
- and other basic stuff such as waiting.

Note contrary to the CLI mode, __no controls are performed on input values of
these methods and then, it is easy to corrupt motor registries__.
Such state will require a reboot of the robot.

**Kind**: inner class of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  

* [~Script](#module_poppy-robot-client..Script)
    * [new Script(...motorIds)](#new_module_poppy-robot-client..Script_new)
    * [.select(...motorId)](#module_poppy-robot-client..Script+select) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
    * [.led(value)](#module_poppy-robot-client..Script+led) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
    * [.position(value, [wait])](#module_poppy-robot-client..Script+position) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
    * [.rotate(value, [wait])](#module_poppy-robot-client..Script+rotate) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
    * [.speed(value)](#module_poppy-robot-client..Script+speed) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
    * [.compliant(value)](#module_poppy-robot-client..Script+compliant) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
    * [.wait(value)](#module_poppy-robot-client..Script+wait) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)

<a name="new_module_poppy-robot-client..Script_new"></a>

#### new Script(...motorIds)
Create a new Script Object.

It could optionally set the targeted motor for the next actions of
this script.


| Param | Type | Description |
| --- | --- | --- |
| ...motorIds | <code>string</code> | the motor id/name or 'all' to select all motors |

**Example**  
```js
const Script = require('poppy-robot-client').Script;

let script = new Script('all') // Select all motors
  .compliant(false) // Make them "drivable"
  .speed(100) // Set all motor speed to 100
 ;

let myOtherScript = new Script('m1', 'm3') // Only select the 'm1' and 'm2' motors
  .rotate(30) // rotate 'm1' and 'm3' by 30 degrees.
  .select('m4') // select the 'm4' motor for next action
  .rotate(20) // Rotate 'm4' by 20 degrees
;
```
<a name="module_poppy-robot-client..Script+select"></a>

#### script.select(...motorId) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
Select the target motor(s) for the next script actions.
It will define the targeted motor(s) until the next __select__ action, if any.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-client..Script)  

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
;
```
<a name="module_poppy-robot-client..Script+led"></a>

#### script.led(value) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
Set the led value of the target motor(s).

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-client..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> | value for the 'led' registry |

**Example**  
```js
let script = P.createScript('all')
   .led('blue') // will set the led color to blue
;
```
<a name="module_poppy-robot-client..Script+position"></a>

#### script.position(value, [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
Set the target position (registry 'goal_position') of the selected motor(s).

It will create an action which will move the selected motor(s) to a given position.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-client..Script)  

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
;
```
<a name="module_poppy-robot-client..Script+rotate"></a>

#### script.rotate(value, [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
Create an action to rotate the selected motor(s) by x degrees.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-client..Script)  

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
;
```
<a name="module_poppy-robot-client..Script+speed"></a>

#### script.speed(value) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
Set the speed (registry 'moving_speed') of the selected motor(s).

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-client..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | the speed value. It should be included into    the [0,1023] range (speed is conversely to the value) |

**Example**  
```js
let script = P.createScript('all')
   .speed(100) // Set the speed of all motor to 100
;
```
<a name="module_poppy-robot-client..Script+compliant"></a>

#### script.compliant(value) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
Set the 'compliant' registry of the selected motor(s).
It allows to select the motor state between programmatically "drivable" (false)
 or in "rest" mode (true) _i.e._ movable by hand.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-client..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | __false__ for "drivable" state, __true__ for "rest" mode. |

**Example**  
```js
let script = P.createScript('all')
   .compliant(false)
;
```
<a name="module_poppy-robot-client..Script+wait"></a>

#### script.wait(value) ⇒ [<code>Script</code>](#module_poppy-robot-client..Script)
The wait method. It allows to stop the script execution during a given
delay.

It mainly dedicated to wait the end of asynchronous actions.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-client..Script)  

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
;
```
<a name="module_poppy-robot-client..ExtMotorRequest"></a>

### poppy-robot-client~ExtMotorRequest ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)
Class representing a Poppy Motor which handles both low-level and 
high-level actions on Poppy motor.

**Kind**: inner class of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**Extends**: [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)  

* [~ExtMotorRequest](#module_poppy-robot-client..ExtMotorRequest) ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)
    * [new ExtMotorRequest(motor, requestHandler)](#new_module_poppy-robot-client..ExtMotorRequest_new)
    * [.setSpeed(value)](#module_poppy-robot-client..ExtMotorRequest+setSpeed) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.setCompliant(value)](#module_poppy-robot-client..ExtMotorRequest+setCompliant) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.setPosition(value, [value])](#module_poppy-robot-client..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.rotate(@param, [wait])](#module_poppy-robot-client..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.wait(value)](#module_poppy-robot-client..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.set(register_name, data)](#module_poppy-robot-client..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(register_name)](#module_poppy-robot-client..RawMotorRequest+get) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
    * [.led(color)](#module_poppy-robot-client..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.getLedValues()](#module_poppy-robot-client..RawMotorRequest+getLedValues) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_module_poppy-robot-client..ExtMotorRequest_new"></a>

#### new ExtMotorRequest(motor, requestHandler)
Instantiate a new (extended) motor object.


| Param | Type | Description |
| --- | --- | --- |
| motor | [<code>MotorDescriptor</code>](#module_poppy-robot-client..MotorDescriptor) | motor descriptor |
| requestHandler | [<code>PoppyRequestHandler</code>](#module_poppy-robot-client..PoppyRequestHandler) | Poppy request handler object |

<a name="module_poppy-robot-client..ExtMotorRequest+setSpeed"></a>

#### extMotorRequest.setSpeed(value) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set the speed (registry 'moving_speed') of the motor.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | the speed value. It should be included into    the [0,1023] range (speed is conversely to the value) |

<a name="module_poppy-robot-client..ExtMotorRequest+setCompliant"></a>

#### extMotorRequest.setCompliant(value) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set the 'compliant' registry of the selected motor(s).

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | __false__ for "drivable" state, __true__ for "rest" mode. |

<a name="module_poppy-robot-client..ExtMotorRequest+setPosition"></a>

#### extMotorRequest.setPosition(value, [value]) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set the target position (registry 'goal_position') of the selected motor(s).

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the position to reach in degree |
| [value] | <code>boolean</code> | <code>false</code> | optionally wait that motor reachs the target position |

<a name="module_poppy-robot-client..ExtMotorRequest+rotate"></a>

#### extMotorRequest.rotate(@param, [wait]) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Rotate the selected motor(s) by x degrees.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| @param | <code>integer</code> |  | value - the rotation value, in degrees |
| [wait] | <code>boolean</code> | <code>true</code> | optionally wait that motor will finish its rotation |

<a name="module_poppy-robot-client..ExtMotorRequest+wait"></a>

#### extMotorRequest.wait(value) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Convinient wiat method

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | wait delay (in ms) |

<a name="module_poppy-robot-client..RawMotorRequest+set"></a>

#### extMotorRequest.set(register_name, data) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set a register of the motor to a given value.

Not it must not be used for the led registry 
(see dedicated method.)

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| register_name | <code>string</code> | register name |
| data | <code>string</code> | data as string |

<a name="module_poppy-robot-client..RawMotorRequest+get"></a>

#### extMotorRequest.get(register_name) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
(__async method__)
Get value of a given register.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| register_name | <code>string</code> | register name |

<a name="module_poppy-robot-client..RawMotorRequest+led"></a>

#### extMotorRequest.led(color) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set the led register.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> \| <code>&#x27;white&#x27;</code> | register name |

<a name="module_poppy-robot-client..RawMotorRequest+getLedValues"></a>

#### extMotorRequest.getLedValues() ⇒ <code>Array.&lt;string&gt;</code>
Get the led values.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-client..ExtMotorRequest)  
<a name="module_poppy-robot-client..RawMotorRequest"></a>

### poppy-robot-client~RawMotorRequest
Class handling the primary requests to a Poppy motor _i.e._ the motor registry accesses.

**Kind**: inner class of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**See**: [PoppyRequestHandler](#module_poppy-robot-client..PoppyRequestHandler)  

* [~RawMotorRequest](#module_poppy-robot-client..RawMotorRequest)
    * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-client..RawMotorRequest_new)
    * [.set(register_name, data)](#module_poppy-robot-client..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(register_name)](#module_poppy-robot-client..RawMotorRequest+get) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
    * [.led(color)](#module_poppy-robot-client..RawMotorRequest+led) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.getLedValues()](#module_poppy-robot-client..RawMotorRequest+getLedValues) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_module_poppy-robot-client..RawMotorRequest_new"></a>

#### new RawMotorRequest(motor, requestHandler)
Instantiate a new raw motor object.


| Param | Type | Description |
| --- | --- | --- |
| motor | [<code>MotorDescriptor</code>](#module_poppy-robot-client..MotorDescriptor) | motor descriptor |
| requestHandler | [<code>PoppyRequestHandler</code>](#module_poppy-robot-client..PoppyRequestHandler) | Poppy request handler object |

<a name="module_poppy-robot-client..RawMotorRequest+set"></a>

#### rawMotorRequest.set(register_name, data) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set a register of the motor to a given value.

Not it must not be used for the led registry 
(see dedicated method.)

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| register_name | <code>string</code> | register name |
| data | <code>string</code> | data as string |

<a name="module_poppy-robot-client..RawMotorRequest+get"></a>

#### rawMotorRequest.get(register_name) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
(__async method__)
Get value of a given register.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| register_name | <code>string</code> | register name |

<a name="module_poppy-robot-client..RawMotorRequest+led"></a>

#### rawMotorRequest.led(color) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set the led register.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> \| <code>&#x27;white&#x27;</code> | register name |

<a name="module_poppy-robot-client..RawMotorRequest+getLedValues"></a>

#### rawMotorRequest.getLedValues() ⇒ <code>Array.&lt;string&gt;</code>
Get the led values.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-client..RawMotorRequest)  
<a name="module_poppy-robot-client..PoppyRequestHandler"></a>

### poppy-robot-client~PoppyRequestHandler
Class in charge of the requests to the Poppy Robot.

It allow requesting the rest APIs exposed by both http and snap server
served by the Poppy robot.

**Kind**: inner class of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  

* [~PoppyRequestHandler](#module_poppy-robot-client..PoppyRequestHandler)
    * [new PoppyRequestHandler([connect])](#new_module_poppy-robot-client..PoppyRequestHandler_new)
    * [.getSettings()](#module_poppy-robot-client..PoppyRequestHandler+getSettings) ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-client..ConnectionSettings)
    * [.setMotorRegister(motor_name, register_name, data)](#module_poppy-robot-client..PoppyRequestHandler+setMotorRegister) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.getMotorRegister(motor_name, register_name)](#module_poppy-robot-client..PoppyRequestHandler+getMotorRegister) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
    * [.getAliases()](#module_poppy-robot-client..PoppyRequestHandler+getAliases) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
    * [.getAliasMotors(alias)](#module_poppy-robot-client..PoppyRequestHandler+getAliasMotors) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>

<a name="new_module_poppy-robot-client..PoppyRequestHandler_new"></a>

#### new PoppyRequestHandler([connect])
Instantiate a new Poppy Request Handler.

Default instantiation will use the default poppy ergo jr connection
settings.


| Param | Type | Description |
| --- | --- | --- |
| [connect] | [<code>ConnectionSettings</code>](#module_poppy-robot-client..ConnectionSettings) | connection settings |

<a name="module_poppy-robot-client..PoppyRequestHandler+getSettings"></a>

#### poppyRequestHandler.getSettings() ⇒ [<code>ConnectionSettings</code>](#module_poppy-robot-client..ConnectionSettings)
Return an object including the connection settings

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-client..PoppyRequestHandler)  
<a name="module_poppy-robot-client..PoppyRequestHandler+setMotorRegister"></a>

#### poppyRequestHandler.setMotorRegister(motor_name, register_name, data) ⇒ <code>Promise.&lt;null&gt;</code>
(__async method__)
Set a register of a given motor with a value.

Not it must not be used for the led registry 
(see dedicated method.)

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-client..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| motor_name | <code>string</code> | motor name/id |
| register_name | <code>string</code> | register name |
| data | <code>string</code> | data as string |

<a name="module_poppy-robot-client..PoppyRequestHandler+getMotorRegister"></a>

#### poppyRequestHandler.getMotorRegister(motor_name, register_name) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
(__async method__)
Get value of a given register for a given motor.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-client..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| motor_name | <code>string</code> | motor name/id |
| register_name | <code>string</code> | register name |

<a name="module_poppy-robot-client..PoppyRequestHandler+getAliases"></a>

#### poppyRequestHandler.getAliases() ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
(__async method__)
Get the aliases of the Poppy Robot.

Note the data of the ResponseObject will be an array containing the alias name/ids.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-client..PoppyRequestHandler)  
<a name="module_poppy-robot-client..PoppyRequestHandler+getAliasMotors"></a>

#### poppyRequestHandler.getAliasMotors(alias) ⇒ <code>Promise.&lt;ResponseObject&gt;</code>
(__async method__)
Get the motor of a given alias.

Note the data of the ResponseObject will be an array containing the motor name/ids.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-client..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>string</code> | alias name/id |

<a name="module_poppy-robot-client..MotorDescriptor"></a>

### poppy-robot-client~MotorDescriptor : <code>Object</code>
Motor Descriptor.

**Kind**: inner typedef of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name/id of the motor |
| lower_limit | <code>int</code> | lower angle boundary of the motor |
| upper_limit | <code>int</code> | upper angle boundary of the motor |

<a name="module_poppy-robot-client..ConnectionSettings"></a>

### poppy-robot-client~ConnectionSettings : <code>Object</code>
Connection Settings to Poppy Robot.

**Kind**: inner typedef of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**Category**: Typedefs  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [schema] | <code>string</code> | <code>&quot;http&quot;</code> | type of request. Not intended to be changed |
| [ip] | <code>string</code> | <code>&quot;poppy.local&quot;</code> | hostname/ip of the targeted Poppy robot |
| [httpPort] | <code>int</code> | <code>8080</code> | port of the http port served by the Poppy robot |
| [snapPort] | <code>int</code> | <code>6969</code> | port of the snap port served by the Poppy robot (used for led) |
| [timeout] | <code>int</code> | <code>2000</code> | request timeout (in ms) |

<a name="module_poppy-robot-client..ResponseObject"></a>

### poppy-robot-client~ResponseObject : <code>Object</code>
Response object to any request to poppy. 

This object is the JSON returned by the request.
Consult this [page](https://github.com/poppy-project/pypot/blob/master/REST-APIs.md) which describes the REST API of the pypot http server.

**Kind**: inner typedef of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [register] | <code>string</code> | a property set to the queried register name |
| [register.data] | <code>undefined</code> | value of the register |

<a name="module_poppy-robot-client..DescriptorLocator"></a>

### poppy-robot-client~DescriptorLocator : <code>string</code>
A String to locate a Poppy descriptor whith a format inspired by the URI one: 'schema://path'

**Kind**: inner typedef of [<code>poppy-robot-client</code>](#module_poppy-robot-client)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| schema | <code>&#x27;file&#x27;</code> \| <code>&#x27;desc&#x27;</code> | 'file' to refer to a local descriptor;           'desc' to refer to an inner descriptor of the module |
| : | <code>path</code> | 'file' case: absolute or relative path to a local descriptor file,          'desc' case: id to an embedded descriptor (only poppy-ergo-jr is nowadays supported) |

**Example**  
```js
let locator = 'file://myPoppy.json'; // locator to a local descriptor file  named myPoppy.json
let myOtherLocator = 'desc://poppy-ergo-jr'; // locator to the (default) Poppy Ergo Jr descriptor 
```
