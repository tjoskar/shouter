'use strict';

import {shouter} from '../src/index';

let extractRar = file => {
    if (file.type !== 'rar') {
        return false;
    }

    // Extract the file and return something
    return {
        path: 'somewhere/far/beyond/'
    };
};

let extractZip = file => {
    if (file.type !== 'zip') {
        return false;
    }

    // Extract the file and return something
    return {
        path: 'in/a/galaxy/far/far/away'
    };
};

shouter.on('extract', 'rar', extractRar);
shouter.on('extract', 'zip', extractZip);

let file = {
    type: 'zip'
};

shouter.trigger('extract', '*', file)
    .results
    .then(files => {
        files
            .filter(f => f)
            .forEach(f => console.log('Yaa!', f.path));
    })
    .catch(error => console.error(error));
