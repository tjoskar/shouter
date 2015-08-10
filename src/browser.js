'use strict';

import {shouter} from './shouter';

if (typeof window !== 'undefined') {
    window.shouter = shouter;
} else {
    var glob = new Function('return this')();
    glob.shouter = shouter;
}
