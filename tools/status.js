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

const colors = require('colors');

const createStatus = (level, ...messages) => {
    return new Status(level, ...messages);
}

class Status {
    constructor(level, ...messages) {
        this.level = level;
        this.messages = [].concat(messages);
        this._children = [];
    }

    getChildren() { return this._children;}

    addChild(status) { this._children.push(status); }

    hasChildren() { 0 <= this._children.length; }

    getLevel() {
        let level = StatusEnum.ok;
        if ( this.hasChildren() ) {
            for (let status of this._children) {
                let current = status.getLevel();
                if ( level < current ) { level = current;}
                if ( current === StatusEnum.error) { break;}
            }
        } else {
            return this.level;
        }
    }

    isOk() { return StatusEnum.ok === this.getLevel();}

}

Status.prototype.display = function(showDetails = false) {
    let msg ='';
    let color = colors.white;
    switch (this.level) {
        case StatusEnum.ok:
            color = colors.green;
            msg += color.inverse('OK');
            break;
        case StatusEnum.warning:
            color = colors.yellow;
            msg += color.inverse('WARNING');
            break;
        case StatusEnum.error:
            color = colors.red;
            msg += color.inverse('KO');
            break;
        default:
            msg += color.inverse('??');
            break;
    }

    if (
        StatusEnum.ok !== this.getLevel()
        && this.messages.length
    ) {
        msg += color(` ${this.messages[0]}`);
    }

    return msg;
}

const StatusEnum = Object.freeze({
    'ok': 0,
    'warning': 1,
    'error': 2
});

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = {
    createStatus,
    StatusEnum
}