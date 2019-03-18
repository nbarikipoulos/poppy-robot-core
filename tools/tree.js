/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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