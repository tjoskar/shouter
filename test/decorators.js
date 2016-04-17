import { assert } from 'chai';
import { shouter } from '../src/index';
import { triggerOnEvent, shoutOnSet, shoutOnGet } from '../src/decorators';

describe('decorators: ', () => {

    beforeEach(shouter._deleteAllEvents);

    describe('triggerOnEvent: ', () => {

        it('should trow error if not both channel and event are specified', () => {
            assert.throw(triggerOnEvent);
            assert.throw(triggerOnEvent.bind(undefined, 'channel'));
            assert.doesNotThrow(triggerOnEvent.bind(undefined, 'channel', 'event'));
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

            triggerOnEvent('channel', 'event')(target, name, descriptor);

            return shouter
                .trigger('channel', 'event')
                .results
                .then(() => {
                    assert.strictEqual(context.called, 1);
                });
        });

    });

    describe('shoutOnSet: ', () => {

        it('should trow error if not both channel and event are specified', () => {
            assert.throw(shoutOnSet);
            assert.throw(shoutOnSet.bind(undefined, 'channel'));
            assert.doesNotThrow(shoutOnSet.bind(undefined, 'channel', 'event'));
        });

        it('should trigger an event', (done) => {
            let context = {called: 0};
            let target = context;
            let name = '';
            let descriptor = {set: () => {}};
            let fun = function() {
                this.called++;
            };

            shouter.on('channel', 'event', fun, context);

            shoutOnSet('channel', 'event')(target, name, descriptor);
            descriptor.set();

            // Ugly, I know but we dont know then we are finish
            setTimeout(() => {
                assert.strictEqual(context.called, 1);
                done();
            }, 1);

        });

    });

    describe('shoutOnGet: ', () => {

        it('should trow error if not both channel and event are specified', () => {
            assert.throw(shoutOnGet);
            assert.throw(shoutOnGet.bind(undefined, 'channel'));
            assert.doesNotThrow(shoutOnGet.bind(undefined, 'channel', 'event'));
        });

        it('should trigger an event', (done) => {
            let context = {called: 0};
            let target = context;
            let name = '';
            let descriptor = {get: () => {}};
            let fun = function() {
                this.called++;
            };

            shouter.on('channel', 'event', fun, context);

            shoutOnGet('channel', 'event')(target, name, descriptor);
            descriptor.get();

            // Ugly, I know but we dont know then we are finish
            setTimeout(() => {
                assert.strictEqual(context.called, 1);
                done();
            }, 1);

        });

    });

});
