/*!
 * (The MIT License)
 *
 * Copyright (c) 2018 N. Barikipoulos <nikolaos.barikipoulos@outlook.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict'

const P = require('poppy-robot-client');

// instantiate the poppy object here to access to the motor ids list
let poppy = P.createPoppy();

let led = [ // The led registry values
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'pink',
    'white'
];

 // Function which returns all motors ids of our robot
let getAllMotors = _ => poppy.getAllMotorIds();

//////////////////////////////////////
// Some utility functions
//////////////////////////////////////

// A function returning a blinking script
let blink = (color, repeat = 5) => {
    let script = P.createScript('all')
        .select('all')
    ;
    let delay = 200; // it does not look nice with lower value 

    for( let i = 0; i < repeat; i++) {
        script.led(color)
            .wait(delay)
            .led('off')
            .wait(delay)
        ;
    }

    return script;
}

//////////////////////////////////////
// Some utility scripts
//////////////////////////////////////


let init = P.createScript('all') // new script and all motor selected
    .compliant(false) // Switch motor to  the programmatically-drivable state
    .speed(100) // set them a default speed
;

let end = P.createScript('all') // new script and all motor selected
    .compliant(true) // Switch motor to 'rest' state
    .led('off') // Turn off leds.
;

// This create a motion to a 'stable' position in rest mode
// i.e. 'freeing' motor i.e. switch their compliant states to true
let toStablePosition = P.createScript(); // Create a new script

let tuples = [ // let define an array of tuple (motor/target position)
    [ 'm2', -90]
    ,[ 'm3', 90]
    ,[ 'm4', 0]
    ,[ 'm5', -90]
    ,[ 'm6', 0]
    ,[ 'm1', 0]
];

tuples.forEach( tuple => toStablePosition // for each tuple in tuples, let add to toStablePosition
    .select(tuple[0])    // a select motor action (first element is the motor id)
    .position(tuple[1],false)  // a move to action (second one is the target positon)
);

//here a led chaser behavior script :)
let ledChaser = P.createScript(); // let create a new script

let index = 0;
getAllMotors().forEach(id => ledChaser // For each motor add to the ledChaser script the following instruction
    .select(id) // select the motor with id 'id' (sic)
    .led(led[index++ %7 ]) // why not?
    .wait(200) // wait a little
);
getAllMotors().reverse() // reverse the motor ids array 
   .forEach( id => ledChaser // and then, from m6 to m1 (poppy ergo jr)
        .select(id) // select the motor
        .led('off') // turn off led
        .wait(150) // wait a little
   )
;

//////////////////////////////////////
// Our scripts
//////////////////////////////////////

// Script which will move all motors to the postion 0
let start = P.createScript('all')
    .speed(50) // when moving all motor together, speed seems to be higher depending of the start position/load...
    .position(0,false)
    .wait(1500)
    .speed(100)
;

// a mvt
let mainMoveScript = P.createScript(); // let create a new script

let color = 'pink';

tuples = [ 
    [ 'm1', 60]
    ,[ 'm2', -90]
    ,[ 'm3', 90]
    ,[ 'm4', 90]
    ,[ 'm5', -90]
    ,[ 'm6', 90]
];

tuples.forEach(tuple => mainMoveScript // for each tuple in pos, let add to mainMoveScript
    .select(tuple[0])    // a select motor action (first element is the motor id)
    .position(tuple[1])  // a move to action (second one is the target positon)
    .led('pink')       // at last set the led color of motor
);
mainMoveScript.wait(1000) // wait a little

getAllMotors().reverse() // reverse the motor list...
    .forEach( id => mainMoveScript // and turn off led (nice, isn't it??)
        .select(id)
        .led('off')
        .wait(300)
    )
;

//////////////////////////////////////
// At last, execute the scripts
//////////////////////////////////////

poppy.exec(
    init
    ,blink('blue')
    ,start
    ,ledChaser
    ,mainMoveScript
    ,toStablePosition
    ,ledChaser // once again :)
    ,end
);