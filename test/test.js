'use strict';

import {assert} from 'chai';
import {shouter} from '../src/index';

describe('shouter: ', () => {

	beforeEach(shouter._deleteAllEvents);

	describe('global event name: ', () => {

		it('should receive message on trigger', (done) => {
			var context = {called: 0};

			shouter.on('channelName', '*', function() {
				this.called++;
			}, context);

			shouter
				.trigger('channelName')
				.results
				.then(() => {
					assert.strictEqual(context.called, 1);
					done();
				});
		});

		it('"on" method should accept arguments', (done) => {
			var context = {called: 0, result: 1};

			shouter.on('channelName', '*', function(n) {
				this.called++;
				this.result += n;
			}, context);

			shouter
				.trigger('channelName', '*', 5)
				.results
				.then(() => {
					assert.strictEqual(context.called, 1);
					assert.strictEqual(context.result, 6);
					done();
				});
		});

		it('should accept multiply listeners', function(done) {
			var context = {'called': 0, 'result': 1};
			shouter.on('channelName', '*', function(n) {
				this.called++;
				this.result += n;
			}, context);

			shouter.on('channelName', '*', function() {
				this.called++;
			}, context);

			shouter
				.trigger('channelName', '*', 5)
				.results
				.then(() => {
					assert.strictEqual(context.called, 2);
					assert.strictEqual(context.result, 6);
					done();
				});
		});

		it('should be able to queue events', function() {
			var context = {'called': 0};

			shouter.trigger('channelName', '*').save();
			shouter.trigger('channelName', '*').save();

			shouter.on('channelName', '*', function() {
				this.called++;
			}, context, true);

			assert.strictEqual(context.called, 2);
		});

		it('should be able to queue events with arguments', function() {
			var context = {'called': 0, 'sum': 0};
			var context2 = {'called': 0, 'sum': 0};

			shouter.trigger('channelName', '*', 3).save();
			shouter.trigger('channelName', '*', 5).save();

			shouter.on('channelName', '*', function(n) {
				this.called++;
				this.sum += n;
			}, context, true);

			shouter.on('channelName', '*', function(n) {
				this.called++;
				this.sum += n;
			}, context2);

			assert.strictEqual(context.called, 2);
			assert.strictEqual(context.sum, 8);
			assert.strictEqual(context2.called, 0);
			assert.strictEqual(context2.sum, 0);
		});

		it('should be able to remove event listeners', function(done) {
			var context = {'called': 0, 'sum': 0};
			var fun = function(n) {
				this.called++;
				this.sum += n;
			};
			var fun2 = function(n) {
				this.called++;
				this.sum += n;
			};

			shouter.on('channelName', '*', fun, context);
			shouter.on('channelName', '*', fun2, context);

			shouter
				.trigger('channelName', '*', 3)
				.results
				.then(() => {
					shouter.off('channelName', fun);
					return shouter.trigger('channelName', '*', 3).results;
				})
				.then(() => {
					assert.strictEqual(context.called, 3);
					assert.strictEqual(context.sum, 9);
					done();
				});
		});
	});

	describe('specified event name: ', () => {

		it('should receive message on trigger', (done) => {
			let context = {called: 0};
			let context2 = {called: 0};

			shouter.on('channelName', 'eventName', function() {
				this.called++;
			}, context);
			shouter.on('channelName', 'eventName2', function() {
				this.called++;
			}, context2);

			shouter
				.trigger('channelName', 'eventName')
				.results
				.then(() => {
					assert.strictEqual(context.called, 1);
					done();
				});

		});

		it('should trigger all listeners on channel when * as event name', function(done) {
			var context = {'called': 0, 'result': 1};
			shouter.on('channelName', 'eventName', function(n) {
				this.called++;
				this.result += n;
			}, context);

			shouter.on('channelName', 'eventName2', function() {
				this.called++;
			}, context);

			shouter
				.trigger('channelName', '*', 5)
				.results
				.then(() => {
					assert.strictEqual(context.called, 2);
					assert.strictEqual(context.result, 6);
					done();
				});
		});

		it('should be able to queue events with arguments', function() {
			var context = {'called': 0, 'sum': 0};
			shouter.trigger('channelName', 'eventName', 3).save();

			shouter.on('channelName', 'eventName', function(n) {
				this.called++;
				this.sum += n;
			}, context, true);

			assert.strictEqual(context.called, 1);
			assert.strictEqual(context.sum, 3);
		});

		it('should be able to remove event listeners', function(done) {
			var context = {'called': 0, 'sum': 0};
			var fun = function(n) {
				this.called++;
				this.sum += n;
			};
			shouter.on('channelName', 'eventName', fun, context);

			shouter
				.trigger('channelName', 'eventName', 3)
				.results
				.then(() => {
					shouter.off('channelName', 'eventName', fun);
					return shouter.trigger('channelName', 'eventName', 3).results;
				})
				.then(() => shouter.trigger('channelName', '*', 3).results)
				.then(() => {
					assert.strictEqual(context.called, 1);
					assert.strictEqual(context.sum, 3);
					done();
				});
		});

	});

});
