/*eslint no-undef:0*/
'use strict';

import {shouter} from './shouter';
import {triggerOnEvent, shoutOnSet, shoutOnGet} from './decorators';

if (typeof module === 'object' && typeof module.exports === 'object') {
    exports.__esModule = true;
    exports.shouter = shouter;
    exports.triggerOnEvent = triggerOnEvent;
    exports.shoutOnSet = shoutOnSet;
    exports.shoutOnGet = shoutOnGet;
    exports.default = shouter;
} else {
    window.shouter = shouter;
    if (typeof define === 'function' && define.amd ) {
        define('shouter', [], () => shouter);
    }
}
