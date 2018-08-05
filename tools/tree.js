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

const TREE = {
    shift:    '   ',
    vertical: ' │ ',
    child:    ' ├─',
    last:     ' └─'
}

class Treeify {
    constructor({
        onlyObject = true,
        filter = (property) => true, // show all
    } = {}) {
        this._onlyObject = onlyObject;
        this._filter = filter;
        this._lines = [];
    }

    setCB(cb) {this._cb = cb;}

    iterate(
        current, 
        prefix,
        level,
        isLast = false
    ) {
    
        let parent = current.parent;
        let property = current.property;
        let value = current.value;
    
        let isObject = 'object' === typeof value;
    
        if ( property ) {
            let shift = !level ? '': prefix + (isLast ? TREE.last : TREE.child);
    
            let content = property;

            if ( !isObject ) {
                content += ' ' + value;
            }
    
            if ( this._cb ) {
                content += ' ' + this._cb.call(
                    undefined,
                    property,
                    parent
                );
            }
    
            this._lines.push(shift + content);
        }
    
        if ( isObject ) {
    
            let filteredProps = Object.keys(value)
                .filter( p => this._filter.call(undefined, p)
            );

            if ( this._onlyObject ) {
                filteredProps = filteredProps.filter( p => 'object' === typeof value[p]);
            }

            let lastProp = filteredProps.slice(-1)[0];
    
            if ( isLast ) {
                prefix += TREE.shift;
            } else {
                prefix += (!level ? '' : TREE.vertical);
            }
    
            for (let p of filteredProps) {
                this.iterate({
                    parent: value,
                    property: p,
                    value: value[p]
                },
                prefix,
                level + 1,
                p === lastProp);
            }
        }
    }

}

const start = (
    object,
    cb,
    options //filter = (property) => true
) => {

    let tree = new Treeify(options);

    tree.setCB(cb);

    tree.iterate(
        { property:'', value: object},
        '',
        0,
        false
    );

    return tree._lines.reduce(
        (acc, line) => acc + line + '\n',
        ''
    );

}


/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = {
    toTree: start
}