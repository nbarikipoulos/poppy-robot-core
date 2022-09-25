# poppy-robot-core API Reference
This module is the main entry point for poppy robot core.
As user facing module, It exports the poppy-robot-core primary
public API and provides convenience accessors to certain sub-modules.

The poppy-robot-core module is mainly based on the following objects:
- The Poppy object that handles:
     - The robot configuration (its structure, connection settings) and motor objects,
     - A script execution engine in order to perform actions on motors.
- The Motor Objects:
     - ExtMotorRequest that handles high-level actions on motors,
     - RawMotorRequest that handles the low-level requests to the motor registers.
- At last, the PoppyRequestHandler object in charge of all the requests to the pypot REST API.

Furthermore, it exposes a bunch of high-level factories in order to ease use of
 these objects such as settings connection parameters, automatically perform a live discovering
 of the target robot, and so on.

**Version**: 11.1.0  

* [poppy-robot-core](#module_poppy-robot-core)
    * _static_
        * [.discoverDescriptor([config])](#module_poppy-robot-core.discoverDescriptor) ⇒ [<code>Promise.&lt;Descriptor&gt;</code>](#module_poppy-robot-core..Descriptor)
        * [.createPoppy([config])](#module_poppy-robot-core.createPoppy) ⇒ [<code>Promise.&lt;Poppy&gt;</code>](#module_poppy-robot-core..Poppy)
        * [.createRequestHandler([config])](#module_poppy-robot-core.createRequestHandler) ⇒ [<code>Promise.&lt;PoppyRequestHandler&gt;</code>](#module_poppy-robot-core..PoppyRequestHandler)
        * [.createDescriptor([config])](#module_poppy-robot-core.createDescriptor) ⇒ [<code>Promise.&lt;Descriptor&gt;</code>](#module_poppy-robot-core..Descriptor)
        * [.createScript([...motorNames])](#module_poppy-robot-core.createScript) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * _inner_
        * [~Poppy](#module_poppy-robot-core..Poppy)
            * [new Poppy(descriptor, [config])](#new_module_poppy-robot-core..Poppy_new)
            * [.descriptor](#module_poppy-robot-core..Poppy+descriptor) ⇒ [<code>Descriptor</code>](#module_poppy-robot-core..Descriptor)
            * [.requestHandler](#module_poppy-robot-core..Poppy+requestHandler) ⇒ [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)
            * [.motorNames](#module_poppy-robot-core..Poppy+motorNames) ⇒ <code>Array.&lt;string&gt;</code>
            * [.toMotorNames(names)](#module_poppy-robot-core..Poppy+toMotorNames) ⇒ <code>Array.&lt;string&gt;</code>
            * [.getMotor(name)](#module_poppy-robot-core..Poppy+getMotor) ⇒ [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)
            * [.move(input)](#module_poppy-robot-core..Poppy+move) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.rotate(input)](#module_poppy-robot-core..Poppy+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.goto(input)](#module_poppy-robot-core..Poppy+goto) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.query(input)](#module_poppy-robot-core..Poppy+query) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.exec(...scripts)](#module_poppy-robot-core..Poppy+exec) ⇒ <code>Promise.&lt;null&gt;</code>
        * [~PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)
            * [new PoppyRequestHandler([config])](#new_module_poppy-robot-core..PoppyRequestHandler_new)
            * [.settings](#module_poppy-robot-core..PoppyRequestHandler+settings) ⇒ [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig)
            * [.perform(url, method, [config])](#module_poppy-robot-core..PoppyRequestHandler+perform) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.get(url, [config])](#module_poppy-robot-core..PoppyRequestHandler+get) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.post(url, data, [config])](#module_poppy-robot-core..PoppyRequestHandler+post) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.setRegister(motorName, registerName, value)](#module_poppy-robot-core..PoppyRequestHandler+setRegister) ⇒ <code>Promise.&lt;Object&gt;</code>
            * [.getRegister(motorName, ...registerNames)](#module_poppy-robot-core..PoppyRequestHandler+getRegister) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
            * [.getAliases()](#module_poppy-robot-core..PoppyRequestHandler+getAliases) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
            * [.getAliasMotors(alias)](#module_poppy-robot-core..PoppyRequestHandler+getAliasMotors) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
        * [~ExtMotorRequest](#module_poppy-robot-core..ExtMotorRequest) ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
            * [.name](#module_poppy-robot-core..RawMotorRequest+name) ⇒ <code>string</code>
            * [.setSpeed(value)](#module_poppy-robot-core..ExtMotorRequest+setSpeed) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.setCompliant(value)](#module_poppy-robot-core..ExtMotorRequest+setCompliant) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.setLed(color)](#module_poppy-robot-core..ExtMotorRequest+setLed)
            * [.setPosition(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.rotate(value, [duration], [wait])](#module_poppy-robot-core..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.goto(position, duration, [wait])](#module_poppy-robot-core..ExtMotorRequest+goto) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.wait(value)](#module_poppy-robot-core..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.computeDuration(data)](#module_poppy-robot-core..ExtMotorRequest+computeDuration) ⇒ <code>number</code>
            * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
            * [.getRegisterValue(...registerNames)](#module_poppy-robot-core..RawMotorRequest+getRegisterValue) ⇒ <code>Promise.&lt;(string\|integer\|boolean)&gt;</code>
        * [~RawMotorRequest](#module_poppy-robot-core..RawMotorRequest)
            * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-core..RawMotorRequest_new)
            * [.name](#module_poppy-robot-core..RawMotorRequest+name) ⇒ <code>string</code>
            * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
            * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
            * [.getRegisterValue(...registerNames)](#module_poppy-robot-core..RawMotorRequest+getRegisterValue) ⇒ <code>Promise.&lt;(string\|integer\|boolean)&gt;</code>
        * [~Script](#module_poppy-robot-core..Script)
            * [new Script(...motorNames)](#new_module_poppy-robot-core..Script_new)
            * [.select(...motorNames)](#module_poppy-robot-core..Script+select) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.led(value)](#module_poppy-robot-core..Script+led) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.goto(value, [duration], [wait])](#module_poppy-robot-core..Script+goto) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.rotate(value, [duration], [wait])](#module_poppy-robot-core..Script+rotate) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.speed(value)](#module_poppy-robot-core..Script+speed) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.compliant()](#module_poppy-robot-core..Script+compliant) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.stiff()](#module_poppy-robot-core..Script+stiff) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
            * [.wait(value)](#module_poppy-robot-core..Script+wait) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
        * [~ScriptEngine](#module_poppy-robot-core..ScriptEngine)
            * [.exec(...scripts)](#module_poppy-robot-core..ScriptEngine+exec) ⇒ <code>Promise.&lt;null&gt;</code>
        * _Typedefs_
            * [~Descriptor](#module_poppy-robot-core..Descriptor) : <code>Object</code>
            * [~ResponseObject](#module_poppy-robot-core..ResponseObject) : <code>Object</code>
            * [~PoppyConfig](#module_poppy-robot-core..PoppyConfig) : <code>Object</code>
            * [~MotorDescriptor](#module_poppy-robot-core..MotorDescriptor) : <code>Object</code>

<a name="module_poppy-robot-core.discoverDescriptor"></a>

### P.discoverDescriptor([config]) ⇒ [<code>Promise.&lt;Descriptor&gt;</code>](#module_poppy-robot-core..Descriptor)
Discover the target Poppy and create a descriptor object that contains:
- The list of motors,
- The name, id, model and angle range of each motors,
- At last the aliases _i.e._ set/group of motors

**Kind**: static method of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [module:poppy-robot-core~DescriptorLocator](module:poppy-robot-core~DescriptorLocator)  

| Param | Type | Description |
| --- | --- | --- |
| [config] | [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig) | Connection settings |

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
| [config] | [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig) | Connection Settings to Poppy |

**Example**  
```js
const { createPoppy } = require('poppy-robot-core')

// create a poppy object using default connection settings
// aka poppy.local and 8080 as hostname and port
createPoppy().then(poppy => {
 ... // Nice stuff with my poppy
})

// Another Poppy with custom connection settings
const config = {
    host: 'poppy1.local' // hostname set to poppy1.local
    port: 8081   // and REST API served on port 8081
}
createPoppy(config).then(poppy => {
 ... // Other nice stuff with this other poppy
})
```
<a name="module_poppy-robot-core.createRequestHandler"></a>

### P.createRequestHandler([config]) ⇒ [<code>Promise.&lt;PoppyRequestHandler&gt;</code>](#module_poppy-robot-core..PoppyRequestHandler)
Convinient factory in order to create PoppyRequestHandler.
Note it will first set-up missing values (hostname, port and timeout) and,
in a second hand, resolve the hostname.

**Kind**: static method of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| [config] | [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig) | Connection Settings to Poppy |

**Example**  
```js
const { createRequestHandler } = require('poppy-robot-core')

// create a poppy request handler using default connection settings
// aka poppy.local and 8080 as hostname and port
createRequestHandler().then(reqHandler => {
 // Get compliant state of motor m1
 const speed = await reqHandler.get('m1', 'compliant')
 ...  // Nice other stuff
})

// Another request handler to another poppy
const config = {
    host: 'poppy1.local'
    port: 8081
}
createRequestHandler(config).then(reqHandler => {
 // Set motor m1 state to stiff
 await reqHandler.post('m1', 'compliant', false)
 ...  // Nice other stuff
})
```
<a name="module_poppy-robot-core.createDescriptor"></a>

### P.createDescriptor([config]) ⇒ [<code>Promise.&lt;Descriptor&gt;</code>](#module_poppy-robot-core..Descriptor)
Discover the target Poppy and create a descriptor object that contains:
- The list of motors,
- The name, id, model and angle range of each motors,
- At last the aliases _i.e._ set/group of motors

**Kind**: static method of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [module:poppy-robot-core~DescriptorLocator](module:poppy-robot-core~DescriptorLocator)  

| Param | Type | Description |
| --- | --- | --- |
| [config] | [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig) | Connection settings |

**Example**  
```js
const { createDescriptor } = require('poppy-robot-core')

// Discover the structure/configuration of a poppy using default connection settings
// aka poppy.local and 8080 as hostname and port
createDescriptor().then(descriptor => {
 console.log(descriptor)
})

// Discover another poppy:
const config = {
    host: 'poppy1.local'
    port: 8081
}
createDescriptor(config).then(descriptor => {
 console.log(descriptor)
})
```
<a name="module_poppy-robot-core.createScript"></a>

### P.createScript([...motorNames]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Convinient factory in order to create a new Poppy Script Object.
It optionally allows selecting a bunch of motor (identified by their names) or
all motors to apply to next actions until call to the select method, if any.

**Kind**: static method of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [Script](#module_poppy-robot-core..Script)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [...motorNames] | <code>string</code> | <code>&quot;&#x27;all&#x27;&quot;</code> | the motor name(s) or 'all' to select all motors |

**Example**  
```js
const { createScript } = require('poppy-robot-core')

// Create a new Script object and automatically target all motors
let myScript = createScript('all')

// Note it is equivalent to
let myOtherScript = createScript()
  .select('all')

// Below an example of script
let anotherScript = createScript('all')
  .select('all') // Select all motors...
  .stiff() // Make them programmatically "drivable"
  .goto(0) // ... move all motors to position 'O' degree.
  . ...        // ... do other nice stuffs (always on all motors)
  .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
  .rotate(30) // and apply them a rotation by +30 degrees.
```
<a name="module_poppy-robot-core..Poppy"></a>

### poppy-robot-core~Poppy
The main object of the module.
The poppy object handles:
- The robot descriptor aka the aliases and motors configuration,
- The object in charge of the requests to the robot,
- At last the script execution engine.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  

* [~Poppy](#module_poppy-robot-core..Poppy)
    * [new Poppy(descriptor, [config])](#new_module_poppy-robot-core..Poppy_new)
    * [.descriptor](#module_poppy-robot-core..Poppy+descriptor) ⇒ [<code>Descriptor</code>](#module_poppy-robot-core..Descriptor)
    * [.requestHandler](#module_poppy-robot-core..Poppy+requestHandler) ⇒ [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)
    * [.motorNames](#module_poppy-robot-core..Poppy+motorNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.toMotorNames(names)](#module_poppy-robot-core..Poppy+toMotorNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getMotor(name)](#module_poppy-robot-core..Poppy+getMotor) ⇒ [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)
    * [.move(input)](#module_poppy-robot-core..Poppy+move) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.rotate(input)](#module_poppy-robot-core..Poppy+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.goto(input)](#module_poppy-robot-core..Poppy+goto) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.query(input)](#module_poppy-robot-core..Poppy+query) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.exec(...scripts)](#module_poppy-robot-core..Poppy+exec) ⇒ <code>Promise.&lt;null&gt;</code>

<a name="new_module_poppy-robot-core..Poppy_new"></a>

#### new Poppy(descriptor, [config])
Create a new Poppy object.

Note creating a poppy object without any settings will use ones for a Poppy Ergo Jr,


| Param | Type | Description |
| --- | --- | --- |
| descriptor | [<code>Descriptor</code>](#module_poppy-robot-core..Descriptor) | Robot descriptor |
| [config] | [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig) | Connection settings |

**Example**  
```js
const { Poppy, discoverDescriptor } = require('poppy-robot-core')

const f = async _ => {
  //
  // create a poppy object using default connection settings
  //
  const descriptor = await discoverDescriptor()

  const poppy = new Poppy(descriptor)

  //
  // Let get another robot with with poppy1.local as hostname
  //
  const config = { host: poppy1.local }
  const descriptor1 = await discoverDescriptor(config)

  const poppy1 = new Poppy(descriptor1, config)

  ... // Nice stuff with poppy and poppy1

}
```
<a name="module_poppy-robot-core..Poppy+descriptor"></a>

#### poppy.descriptor ⇒ [<code>Descriptor</code>](#module_poppy-robot-core..Descriptor)
Accessor to the robot descriptor handled by this instance

**Kind**: instance property of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  
<a name="module_poppy-robot-core..Poppy+requestHandler"></a>

#### poppy.requestHandler ⇒ [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)
Accessor to the request handler for this robot

**Kind**: instance property of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  
<a name="module_poppy-robot-core..Poppy+motorNames"></a>

#### poppy.motorNames ⇒ <code>Array.&lt;string&gt;</code>
Return an array containing all registered motor names of the robot.

**Kind**: instance property of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  
<a name="module_poppy-robot-core..Poppy+toMotorNames"></a>

#### poppy.toMotorNames(names) ⇒ <code>Array.&lt;string&gt;</code>
Convinient function to manage the 'all' keyword for motor names.

If the input parameter is 'all' or an array including it,
it will return an array containing the name of all motors of the robot.
Otherwise, the entry input will be returned.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| names | <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> | Names of motor provided as an array or 'all' |

<a name="module_poppy-robot-core..Poppy+getMotor"></a>

#### poppy.getMotor(name) ⇒ [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)
Accessor on the motor Object by name.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Motor name |

<a name="module_poppy-robot-core..Poppy+move"></a>

#### poppy.move(input) ⇒ <code>Promise.&lt;null&gt;</code>
Move a set of motors to target position(s).

Duration of the movement could be constrained, if provided.
Otherwise, the speed register will be used.

Note the speed register of motors could changed when duration is provided or wait is set to 'true'.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>object</code> |  | input parameters |
| input.motors | <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> |  | Names of the target motors |
| input.positions | <code>Array.&lt;integer&gt;</code> \| <code>integer</code> |  | target position: Either an array containing   all targeted position or an integer if position is the same for all motors |
| [input.duration] | <code>number</code> |  | duration of the movemement (in s) |
| [input.wait] | <code>boolean</code> | <code>false</code> | wait until the end of the movement |

**Example**  
```js
const poppy = ...

// Move all motors to position 0 degrees in 3s awaiting the end of the movement
await poppy.move({
  motors: 'all',
  positions: 0,
  duration: 3,
  wait: true
})

// Send instruction to move m1, m2 and m3 to respectively
// positions 30, 50 and 90 degrees without:
// - Awaiting the end of movement,
// - Constraint on its duration (movement will be based on the speed of motors.)
await poppy.move({
  motors: ['m1', 'm2', 'm3'],
  positions: [30, 50, 90]
})
```
<a name="module_poppy-robot-core..Poppy+rotate"></a>

#### poppy.rotate(input) ⇒ <code>Promise.&lt;null&gt;</code>
Rotate a set of motors.

Duration of the movement could be constrained, if provided.
Otherwise, the speed register will be used.

Note the speed register of motors could changed when duration is provided or wait is set to 'true'.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>object</code> |  | input parameters |
| input.motors | <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> |  | Names of the target motors |
| input.angles | <code>Array.&lt;integer&gt;</code> \| <code>integer</code> |  | rotation values: Either an array containing   all angles or an integer if the rotation is the same for all motors |
| [input.duration] | <code>number</code> |  | duration of the movemement (in s) |
| [input.wait] | <code>boolean</code> | <code>false</code> | wait until the end of the movement |

**Example**  
```js
const poppy = ...

// Rotate all motors by 30 degrees in 3s awaiting the end of the movement
await poppy.move({
  motors: 'all',
  angles: 30,
  duration: 3,
  wait: true
})

// Send instruction to rotate m1, m2 and m3 by respectively
// 30, 30 and 90 degrees without:
// - Awaiting the end of movement,
// - Constraint on its duration (movement will be based on the speed of motors.)
await poppy.move({
  motors: ['m1', 'm2', 'm3'],
  angles: [30, 30, 90]
})
```
<a name="module_poppy-robot-core..Poppy+goto"></a>

#### poppy.goto(input) ⇒ <code>Promise.&lt;null&gt;</code>
Access to the '/motors/goto' endpoint.
Note it will:
  - Be executed whatever the value of the compliant register
  - Set the speed register of targeted motors to fill the duration constraint

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>object</code> |  | input parameters |
| input.motors | <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> |  | Names of the target motors |
| input.positions | <code>Array.&lt;integer&gt;</code> \| <code>integer</code> |  | target position: Either an array containing   all targeted position or an integer if position is the same for all motors |
| input.duration | <code>number</code> |  | duration of the movemement (in s) |
| [input.wait] | <code>boolean</code> | <code>false</code> | wait until the end of the movement |

**Example**  
```js
const poppy = ...

// Move all motors to position 0 degrees in 3s awaiting the end of the movement
await poppy.goto({
  motors: 'all',
  positions: 0,
  duration: 3,
  wait: true
})

// Send instruction to move m1, m2 and m3 to respectively
// positions 30, 50 and 90 degrees in 5s without awaiting the end of movement
await poppy.goto({
  motors: ['m1', 'm2', 'm3'],
  positions: [30, 50, 90],
  duration: 5
})
```
<a name="module_poppy-robot-core..Poppy+query"></a>

#### poppy.query(input) ⇒ <code>Promise.&lt;Object&gt;</code>
Convinient method to query register(s) of all or a set of registered motors.
It returns an object gathering by motor the [ResponseObject](#module_poppy-robot-core..PoppyRequestHandler).

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  
**See**: [ResponseObject](#module_poppy-robot-core..ResponseObject)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>object</code> |  | input parameters |
| [input.motors] | <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> | <code>&#x27;all&#x27;</code> | Names of the target motors |
| input.registers | <code>Array.&lt;string&gt;</code> |  | targeted registers |

**Example**  
```js
const poppy = ...

await poppy.query({
  motors: ['m1', 'm2'],
  registers: ['present_position', 'goal_position']
})
// Will return a promise with result as
// {
//   m1: {present_position: 10, goal_position: 80},
//   m2: {present_position: 0, goal_position: -90},
// }
}
```
<a name="module_poppy-robot-core..Poppy+exec"></a>

#### poppy.exec(...scripts) ⇒ <code>Promise.&lt;null&gt;</code>
Execute Scripts.

**Kind**: instance method of [<code>Poppy</code>](#module_poppy-robot-core..Poppy)  

| Param | Type | Description |
| --- | --- | --- |
| ...scripts | [<code>Script</code>](#module_poppy-robot-core..Script) \| [<code>Array.&lt;Script&gt;</code>](#module_poppy-robot-core..Script) | The scripts to execute |

<a name="module_poppy-robot-core..PoppyRequestHandler"></a>

### poppy-robot-core~PoppyRequestHandler
Class in charge of the requests to the Poppy Robot.

It allows requesting the REST API exposed by the http server located on
the Robot.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  

* [~PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)
    * [new PoppyRequestHandler([config])](#new_module_poppy-robot-core..PoppyRequestHandler_new)
    * [.settings](#module_poppy-robot-core..PoppyRequestHandler+settings) ⇒ [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig)
    * [.perform(url, method, [config])](#module_poppy-robot-core..PoppyRequestHandler+perform) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.get(url, [config])](#module_poppy-robot-core..PoppyRequestHandler+get) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.post(url, data, [config])](#module_poppy-robot-core..PoppyRequestHandler+post) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.setRegister(motorName, registerName, value)](#module_poppy-robot-core..PoppyRequestHandler+setRegister) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getRegister(motorName, ...registerNames)](#module_poppy-robot-core..PoppyRequestHandler+getRegister) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
    * [.getAliases()](#module_poppy-robot-core..PoppyRequestHandler+getAliases) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.getAliasMotors(alias)](#module_poppy-robot-core..PoppyRequestHandler+getAliasMotors) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>

<a name="new_module_poppy-robot-core..PoppyRequestHandler_new"></a>

#### new PoppyRequestHandler([config])
Instantiate a new Poppy Request Handler.

Default instantiation will use the default poppy ergo jr connection
settings.


| Param | Type | Description |
| --- | --- | --- |
| [config] | [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig) | connection settings |

**Example**  
```js
const { PoppyRequestHandler: ReqHandler } = require('poppy-robot-core')

 let req = new ReqHandler()

 // set the 'moving_speed' register of the motor 'm1' to 100.
 req.setRegister('m1', 'moving_speed', '100')

 //...

 // get current position of the motor 'm1'
 // will return a promise with result as: {'present_position': 15}
 req.getRegister('m1', 'present_position')
```
<a name="module_poppy-robot-core..PoppyRequestHandler+settings"></a>

#### poppyRequestHandler.settings ⇒ [<code>PoppyConfig</code>](#module_poppy-robot-core..PoppyConfig)
Return connection settings

**Kind**: instance property of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
<a name="module_poppy-robot-core..PoppyRequestHandler+perform"></a>

#### poppyRequestHandler.perform(url, method, [config]) ⇒ <code>Promise.&lt;Object&gt;</code>
Method performing request to the robot api.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Axios Response schema object  
**See**: https://github.com/axios/axios  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | relative or absolute url to REST API served by the http server. |
| method | <code>string</code> | request method. |
| [config] | <code>Object</code> | extra axios client settings. |

**Example**  
```js
const { PoppyRequestHandler: ReqHandler } = require('poppy-robot-core')

 const req = new ReqHandler({ host: 'poppy.home' })

// Get: get the list the registers of the motor 'm1'
 // aka perform a get request on http://poppy.local:8080/motor/m1/register/list.json
 req.perform('/motor/m1/register/list.json').then(response => {
   const list = response.data
   // ...
 })

 // Post request: set the 'compliant' register to false aka stiff mode
 // aka perform a post request on http://poppy.local:8080/motor/m1/register/compliant/value.json
 req.perform(
   '/motor/m1/register/compliant/value.json',
   'post',
   { data: 'false' }
 )

 // Override configuration to get logs served on http://poppy.local/api/raw_logs by poppy web server
 req.perform(
   '/api/raw_logs',
   'post',
   { baseURL: 'http://poppy.local', data: 'id=0' }
 )
```
<a name="module_poppy-robot-core..PoppyRequestHandler+get"></a>

#### poppyRequestHandler.get(url, [config]) ⇒ <code>Promise.&lt;Object&gt;</code>
Perform a get request

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Axios Response schema object  
**See**: https://github.com/axios/axios  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | relative url to the REST API. |
| [config] | <code>Object</code> | extra axios client settings |

<a name="module_poppy-robot-core..PoppyRequestHandler+post"></a>

#### poppyRequestHandler.post(url, data, [config]) ⇒ <code>Promise.&lt;Object&gt;</code>
Perform a post request

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Axios Response schema object  
**See**: https://github.com/axios/axios  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | relative url to the REST API. |
| data | <code>\*</code> | data to post |
| [config] | <code>Object</code> | extra axios client settings |

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

#### poppyRequestHandler.getRegister(motorName, ...registerNames) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
Get the value of register(s).
Note if a request for a register failed, its value will be set to undefined.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| motorName | <code>string</code> | motor name/id |
| ...registerNames | <code>string</code> | target register names |

**Example**  
```js
const ReqHandler = require('poppy-robot-core').PoppyRequestHandler

 let req = new ReqHandler()

 req.getRegister('m1', 'present_position', 'compliant')
 // will return a promise with resolved value as:
 // { present_position: 90, compliant: false }
```
<a name="module_poppy-robot-core..PoppyRequestHandler+getAliases"></a>

#### poppyRequestHandler.getAliases() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get the aliases of the Poppy Robot.

Return an array containing the alias names.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  
<a name="module_poppy-robot-core..PoppyRequestHandler+getAliasMotors"></a>

#### poppyRequestHandler.getAliasMotors(alias) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get the motor of a given alias.

Return an array that contains the motor names.

**Kind**: instance method of [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler)  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>string</code> | alias name/id |

<a name="module_poppy-robot-core..ExtMotorRequest"></a>

### poppy-robot-core~ExtMotorRequest ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
Object representing a Poppy Motor that handles both low-level and
high-level actions on Poppy motor.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Extends**: [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

* [~ExtMotorRequest](#module_poppy-robot-core..ExtMotorRequest) ⇐ [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)
    * [.name](#module_poppy-robot-core..RawMotorRequest+name) ⇒ <code>string</code>
    * [.setSpeed(value)](#module_poppy-robot-core..ExtMotorRequest+setSpeed) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.setCompliant(value)](#module_poppy-robot-core..ExtMotorRequest+setCompliant) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.setLed(color)](#module_poppy-robot-core..ExtMotorRequest+setLed)
    * [.setPosition(value, [wait])](#module_poppy-robot-core..ExtMotorRequest+setPosition) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.rotate(value, [duration], [wait])](#module_poppy-robot-core..ExtMotorRequest+rotate) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.goto(position, duration, [wait])](#module_poppy-robot-core..ExtMotorRequest+goto) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.wait(value)](#module_poppy-robot-core..ExtMotorRequest+wait) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.computeDuration(data)](#module_poppy-robot-core..ExtMotorRequest+computeDuration) ⇒ <code>number</code>
    * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
    * [.getRegisterValue(...registerNames)](#module_poppy-robot-core..RawMotorRequest+getRegisterValue) ⇒ <code>Promise.&lt;(string\|integer\|boolean)&gt;</code>

<a name="module_poppy-robot-core..RawMotorRequest+name"></a>

#### extMotorRequest.name ⇒ <code>string</code>
Return the motor name/id.

**Kind**: instance property of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  
<a name="module_poppy-robot-core..ExtMotorRequest+setSpeed"></a>

#### extMotorRequest.setSpeed(value) ⇒ <code>Promise.&lt;null&gt;</code>
Set the 'moving_speed' register.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | the speed value. It should be included into    the [0,1023] range (speed is more or less 0.666 degree.s-1 per unit)    Note using 0 set the speed to the highest possible value. |

<a name="module_poppy-robot-core..ExtMotorRequest+setCompliant"></a>

#### extMotorRequest.setCompliant(value) ⇒ <code>Promise.&lt;null&gt;</code>
Set the 'compliant' register.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>boolean</code> | true/false for compliant/stiff state. |

<a name="module_poppy-robot-core..ExtMotorRequest+setLed"></a>

#### extMotorRequest.setLed(color)
Set the 'led' register.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>&#x27;off&#x27;</code> \| <code>&#x27;red&#x27;</code> \| <code>&#x27;green&#x27;</code> \| <code>&#x27;blue&#x27;</code> \| <code>&#x27;yellow&#x27;</code> \| <code>&#x27;cyan&#x27;</code> \| <code>&#x27;pink&#x27;</code> \| <code>&#x27;white&#x27;</code> | Led color value |

<a name="module_poppy-robot-core..ExtMotorRequest+setPosition"></a>

#### extMotorRequest.setPosition(value, [wait]) ⇒ <code>Promise.&lt;null&gt;</code>
Set the 'goal_position' register to value.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the angle to reach in degree |
| [wait] | <code>boolean</code> | <code>false</code> | wait until the motor reachs the target position |

<a name="module_poppy-robot-core..ExtMotorRequest+rotate"></a>

#### extMotorRequest.rotate(value, [duration], [wait]) ⇒ <code>Promise.&lt;null&gt;</code>
Rotate the motor by x degrees.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the rotation value, in degrees |
| [duration] | <code>number</code> |  | duration of the movemement (in s) |
| [wait] | <code>boolean</code> | <code>false</code> | wait until the motor ends its rotation |

<a name="module_poppy-robot-core..ExtMotorRequest+goto"></a>

#### extMotorRequest.goto(position, duration, [wait]) ⇒ <code>Promise.&lt;null&gt;</code>
Move motor to a given postion setting the duration of the movement.

Note the speed register of the motor could change if 'wait' is set to 'false'.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| position | <code>integer</code> |  | the position to reach in degree |
| duration | <code>number</code> |  | duration of the movemement (in s) |
| [wait] | <code>boolean</code> | <code>false</code> | wait until the motor reachs the target position |

<a name="module_poppy-robot-core..ExtMotorRequest+wait"></a>

#### extMotorRequest.wait(value) ⇒ <code>Promise.&lt;null&gt;</code>
Convinient wait method

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | wait delay (in s) |

<a name="module_poppy-robot-core..ExtMotorRequest+computeDuration"></a>

#### extMotorRequest.computeDuration(data) ⇒ <code>number</code>
Compute expected movement duration between 2 angles (in s).

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Input data |
| [data.start] | <code>integer</code> | Start position. If not provided, it will be set to the current position from register |
| data.end | <code>integer</code> | Target position |
| [data.speed] | <code>integer</code> | Speed. If not provided, it will be set with the value from register |

<a name="module_poppy-robot-core..RawMotorRequest+set"></a>

#### extMotorRequest.set(registerName, data) ⇒ <code>Promise.&lt;null&gt;</code>
Set a register of the motor to a given value.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| registerName | <code>string</code> | register name |
| data | <code>string</code> \| <code>integer</code> \| <code>boolean</code> | data |

<a name="module_poppy-robot-core..RawMotorRequest+get"></a>

#### extMotorRequest.get(...registerNames) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
Return the value(s) of register(s) as an object.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| ...registerNames | <code>string</code> | target register names |

**Example**  
```js
const {RawMotorRequest: Motor, PoppyRequestHandler: RequestHandler } = require('poppy-robot-core')

let motor = new Motor(
 { name: 'm1', lower_limit: -90, upper_limit: 90},
 new RequestHandler() // default setting to Poppy Ergo Jr
})

motor.get('present_position', 'goal_position')
// Will return a promise with result as
// {
//   present_position: 10,
//   goal_position: 80
// }
```
<a name="module_poppy-robot-core..RawMotorRequest+getRegisterValue"></a>

#### extMotorRequest.getRegisterValue(...registerNames) ⇒ <code>Promise.&lt;(string\|integer\|boolean)&gt;</code>
Return the value of a register as a primitive type.

**Kind**: instance method of [<code>ExtMotorRequest</code>](#module_poppy-robot-core..ExtMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| ...registerNames | <code>string</code> | target register names |

<a name="module_poppy-robot-core..RawMotorRequest"></a>

### poppy-robot-core~RawMotorRequest
Class that handles the primary requests to a Poppy motor _i.e._ access to the registers of the motor.

**Kind**: inner class of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**See**: [PoppyRequestHandler](#module_poppy-robot-core..PoppyRequestHandler)  

* [~RawMotorRequest](#module_poppy-robot-core..RawMotorRequest)
    * [new RawMotorRequest(motor, requestHandler)](#new_module_poppy-robot-core..RawMotorRequest_new)
    * [.name](#module_poppy-robot-core..RawMotorRequest+name) ⇒ <code>string</code>
    * [.set(registerName, data)](#module_poppy-robot-core..RawMotorRequest+set) ⇒ <code>Promise.&lt;null&gt;</code>
    * [.get(...registerNames)](#module_poppy-robot-core..RawMotorRequest+get) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
    * [.getRegisterValue(...registerNames)](#module_poppy-robot-core..RawMotorRequest+getRegisterValue) ⇒ <code>Promise.&lt;(string\|integer\|boolean)&gt;</code>

<a name="new_module_poppy-robot-core..RawMotorRequest_new"></a>

#### new RawMotorRequest(motor, requestHandler)
Create a new raw motor object.


| Param | Type | Description |
| --- | --- | --- |
| motor | [<code>MotorDescriptor</code>](#module_poppy-robot-core..MotorDescriptor) | motor descriptor |
| requestHandler | [<code>PoppyRequestHandler</code>](#module_poppy-robot-core..PoppyRequestHandler) | Poppy request handler object |

**Example**  
```js
const {RawMotorRequest: Motor, PoppyRequestHandler: RequestHandler} = require('poppy-robot-core')

let motor = new Motor(
  { name: 'm1', lower_limit: -90, upper_limit: 90},
  new RequestHandler() // default setting to Poppy Ergo Jr
)

motor.set('moving_speed', '100') // Will set the speed to 100,

//...

motor.get('moving_speed', 'compliant') // Will return a promise with result as
// {
//   moving_speed: 100
//   compliant: true
// }
```
<a name="module_poppy-robot-core..RawMotorRequest+name"></a>

#### rawMotorRequest.name ⇒ <code>string</code>
Return the motor name/id.

**Kind**: instance property of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  
<a name="module_poppy-robot-core..RawMotorRequest+set"></a>

#### rawMotorRequest.set(registerName, data) ⇒ <code>Promise.&lt;null&gt;</code>
Set a register of the motor to a given value.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| registerName | <code>string</code> | register name |
| data | <code>string</code> \| <code>integer</code> \| <code>boolean</code> | data |

<a name="module_poppy-robot-core..RawMotorRequest+get"></a>

#### rawMotorRequest.get(...registerNames) ⇒ [<code>Promise.&lt;ResponseObject&gt;</code>](#module_poppy-robot-core..ResponseObject)
Return the value(s) of register(s) as an object.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| ...registerNames | <code>string</code> | target register names |

**Example**  
```js
const {RawMotorRequest: Motor, PoppyRequestHandler: RequestHandler } = require('poppy-robot-core')

let motor = new Motor(
 { name: 'm1', lower_limit: -90, upper_limit: 90},
 new RequestHandler() // default setting to Poppy Ergo Jr
})

motor.get('present_position', 'goal_position')
// Will return a promise with result as
// {
//   present_position: 10,
//   goal_position: 80
// }
```
<a name="module_poppy-robot-core..RawMotorRequest+getRegisterValue"></a>

#### rawMotorRequest.getRegisterValue(...registerNames) ⇒ <code>Promise.&lt;(string\|integer\|boolean)&gt;</code>
Return the value of a register as a primitive type.

**Kind**: instance method of [<code>RawMotorRequest</code>](#module_poppy-robot-core..RawMotorRequest)  

| Param | Type | Description |
| --- | --- | --- |
| ...registerNames | <code>string</code> | target register names |

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
    * [new Script(...motorNames)](#new_module_poppy-robot-core..Script_new)
    * [.select(...motorNames)](#module_poppy-robot-core..Script+select) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.led(value)](#module_poppy-robot-core..Script+led) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.goto(value, [duration], [wait])](#module_poppy-robot-core..Script+goto) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.rotate(value, [duration], [wait])](#module_poppy-robot-core..Script+rotate) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.speed(value)](#module_poppy-robot-core..Script+speed) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.compliant()](#module_poppy-robot-core..Script+compliant) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.stiff()](#module_poppy-robot-core..Script+stiff) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
    * [.wait(value)](#module_poppy-robot-core..Script+wait) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)

<a name="new_module_poppy-robot-core..Script_new"></a>

#### new Script(...motorNames)
Create a new Script Object.

It could optionally set the targeted motor for the next actions of
this script.


| Param | Type | Description |
| --- | --- | --- |
| ...motorNames | <code>string</code> | the motor name(s) or 'all' to select all motors |

**Example**  
```js
const { Script } = require('poppy-robot-core')

let script = new Script('all') // Select all motors
  .speed(100) // Set all motor speed to 100
  .stiff() // Make them programmatically "drivable"
  .goto(0) // Move all motors to 0 degree.

let myOtherScript = new Script('m1', 'm3') // Only select the 'm1' and 'm2' motors
  .rotate(30) // rotate 'm1' and 'm3' by 30 degrees.
  .select('m4') // select the 'm4' motor for next action
  .rotate(20) // Rotate 'm4' by 20 degrees
```
<a name="module_poppy-robot-core..Script+select"></a>

#### script.select(...motorNames) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Select the target motor(s) for the next script actions.
It will define the targeted motor(s) until the next __select__ action, if any.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| ...motorNames | <code>string</code> | the name(s) of the selected motor or 'all' to select all motors |

**Example**  
```js
let script = new Script('all')
   .select('all') // Select all motors...
   .stiff() // Make them programmatically "drivable"
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
let script = new Script('all')
   .led('blue') // will set the led color to blue
```
<a name="module_poppy-robot-core..Script+goto"></a>

#### script.goto(value, [duration], [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Set the target position (register 'goal_position') of the selected motor(s).

It will create an action that will move the selected motor(s) to the given position.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the position to reach in degree |
| [duration] | <code>number</code> |  | set the movement duration duration (in s) |
| [wait] | <code>boolean</code> | <code>false</code> | wait until motors reach their target positions. |

**Example**  
```js
let script = new Script('m6')
   .goto(90) // Send a request in order to "open" the grip.
                 // It does not wait the end of this movement
                 // and next instructions will be send in the wake of it
   .select('m1')
   .goto(150, 2.5) // move the motor 'm1' to 150 degrees in 2.5s
   .select('m2', 'm3', 'm4')
   .goto(0, true) // Send a instruction to move all selected motors to 0
                  // awaiting the end of the movement.
```
<a name="module_poppy-robot-core..Script+rotate"></a>

#### script.rotate(value, [duration], [wait]) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
Create an action to rotate the selected motor(s) by x degrees.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>integer</code> |  | the rotation value, in degrees |
| [duration] | <code>number</code> |  | set the movement duration duration (in s) |
| [wait] | <code>boolean</code> | <code>false</code> | wait until the selected motors will end   their rotations before executing the next action |

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
   .rotate(-60, 3, true) // perform rotation by -60 degrees in 3s
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
let script = new Script('all')
   .speed(100) // Set the speed of all motor to 100
```
<a name="module_poppy-robot-core..Script+compliant"></a>

#### script.compliant() ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
"Release" selected motor(s) _i.e._ make them movable by hand _i.e._ set their 'compliant' register to 'true'.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  
**Example**  
```js
let endScript = new Script('all')
   .compliant()
```
<a name="module_poppy-robot-core..Script+stiff"></a>

#### script.stiff() ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
"Handle" programmatically selected motor(s) _i.e._ set their 'compliant' register to 'false'.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  
**Example**  
```js
let script = new Script('all')
   .stiff()
```
<a name="module_poppy-robot-core..Script+wait"></a>

#### script.wait(value) ⇒ [<code>Script</code>](#module_poppy-robot-core..Script)
The wait method. It allows to stop the script execution during a given
delay.

**Kind**: instance method of [<code>Script</code>](#module_poppy-robot-core..Script)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | wait delay (in s) |

**Example**  
```js
let script = new Script()
   .select('m2')
   .goto(-90) // we do not wait the end of movement
   .wait(1) // Wait 1 second before executing the next action
   .select('m3')
   .goto(90)
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
| ...scripts | [<code>Script</code>](#module_poppy-robot-core..Script) \| [<code>Array.&lt;Script&gt;</code>](#module_poppy-robot-core..Script) | The scripts to execute |

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
| aliases | <code>Array.&lt;{name: string, motors: Array.&lt;string&gt;}&gt;</code> | Array of aliases and their motors |
| motors | [<code>Array.&lt;MotorDescriptor&gt;</code>](#module_poppy-robot-core..MotorDescriptor) | Array of motor descriptors |

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

<a name="module_poppy-robot-core..PoppyConfig"></a>

### poppy-robot-core~PoppyConfig : <code>Object</code>
Poppy config object.

**Kind**: inner typedef of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Category**: Typedefs  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [host] | <code>string</code> | <code>&quot;poppy.local&quot;</code> | hostname/ip of the targeted Poppy robot. |
| resolved | <code>string</code> |  | Resolved ip of the targeted Poppy robot, if successful, otherwise set to the host value. |
| [port] | <code>int</code> | <code>8080</code> | Port of the pypot REST API |
| [timeout] | <code>int</code> | <code>500</code> | Request timeout (in ms) |

<a name="module_poppy-robot-core..MotorDescriptor"></a>

### poppy-robot-core~MotorDescriptor : <code>Object</code>
Motor Descriptor.

**Kind**: inner typedef of [<code>poppy-robot-core</code>](#module_poppy-robot-core)  
**Category**: Typedefs  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name/id of the motor |
| model | <code>string</code> | model of the motor |
| lower_limit | <code>int</code> | lower angle boundary of the motor |
| upper_limit | <code>int</code> | upper angle boundary of the motor |

