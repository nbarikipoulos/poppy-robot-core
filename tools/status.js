/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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