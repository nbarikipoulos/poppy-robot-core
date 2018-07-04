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

//////////////////////////////////////
// We hereby write our scripts
//////////////////////////////////////

let init = P.createScript() // Create a new script
    .select('all') // select all motors
    .speed(100) // set speed to 100
    .compliant(false) // make them drivable
;

let toPosition0 = P.createScript() // Create a new script
    .select('all') // select all motors
    .position(0) // move all motor to the position 0 synchronoulsy
                        // i.e. we execute this instruction awaiting that
                        // motor reach their target position before next instruction
;

// This position is a 'stable' rest position when 'freeing' motor i.e. switch their
// compliant states to true
let toPosition1 = P.createScript() // Create a new script
    .select('m2') // select the motor m2
    .position(-90) // move it to the position -90 degrees.
    .select('m3') // select the motor m3
    .position(90)
    .select('m4')
    .position(0)
    .select('m5')
    .position(-90)
    .select('m1')
    .position(0)
;

let openGrip = P.createScript() // Create a new script
    .select('m6') // Select the 'm6' motor
    .position(90) // open it
;

let closeGrip = P.createScript() // Create a new script
    .select('m6') // Select the 'm6' motor
    .position(0) // close it
;

let end = P.createScript()
    .select('all') // select all motors
    .compliant(true) // switch motors to 'rest' state
;

//////////////////////////////////////
// At last, execute the scripts
//////////////////////////////////////

let poppy = P.createPoppy(); // Instantiate a Poppy object

poppy.exec(
    init
    ,toPosition0
    ,openGrip, closeGrip
    ,openGrip, closeGrip // let do it twice
    ,toPosition1 // go to 'stable' rest position
    ,end // 'free' the motors
);