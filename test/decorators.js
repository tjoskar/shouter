'use strict';

import {assert} from 'chai';
import shouter from '../shouter';

describe('shouter: ', () => {

    beforeEach(shouter._deleteAllEvents);

    describe('decorators: ', () => {

        it('should trow error if not both channel and event are specified', () => {
            assert.throw(shouter);
            assert.throw(shouter.bind(undefined, 'channel'));
            assert.doesNotThrow(shouter.bind(undefined, 'channel', 'event'));
        });

        it('should trigger an event', () => {
            let context = {called: 0};
            let target = context;
            let name = '';
            let descriptor = {
                value: function() {
                    this.called++;
                }.bind(context)
            };

            shouter('channel', 'event')(target, name, descriptor);
            descriptor.value();
            shouter.trigger('channel', 'event');

            assert.strictEqual(context.called, 2);
        });

    });

});
