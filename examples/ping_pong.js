'use strict';

import {shouter} from '../shouter';

class Player {

    constructor(name) {
        this.name = name;
    }

    register() {
        console.log(`${this.name} is looking for a player`);
        shouter
            .trigger('game', 'register', this.name)
            .results
            .then(playes => {
                if (playes.length > 0) {
                    console.log(`${this.name}: Wee, we find an other player: ${playes[0]}`);
                    this.play(playes[0], false);
                } else {
                    return Promise.reject();
                }
            })
            .catch(() => {
                console.log(`${this.name}: No one to play with, let's look for a friend`);
                shouter.on('game', 'register', player => {
                    if (player !== this.name) {
                        this.play(player, true);
                        return this.name;
                    }
                }, undefined, true);
            });
    }

    play(player, playerOne) {
        if (playerOne) {
            shouter.trigger('game', this.name, this.saySomething()).save();
        }
        shouter.on('game', player, msg => {
            console.log(`${player}: ${msg}`);
            setTimeout(() => {
                shouter.trigger('game', this.name, this.saySomething(msg));
            }, 1000);
        }, undefined, true);
    }

    saySomething(msg) {
        if (msg === 'ping?') {
            return 'pong!';
        } else {
            return 'ping?';
        }
    }
}


var player1 = new Player('player1');
var player2 = new Player('player2');

player1.register();

// We can register both player immediately after each other.
// Or we can wait a while
setTimeout(() => player2.register(), 1000);

// Output:
// player1 is looking for a player
// player1: No one to play with, let's look for a friend
// player2 is looking for a player
// player2: Wee, we find an other player: player1
// player1: ping?
// player2: pong!
// player1: ping?
// player2: pong!
// player1: ping?
// player2: pong!
// ...
