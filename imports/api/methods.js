import { Meteor } from 'meteor/meteor';

import { Games } from './models/game.js';
import { Players } from './models/player.js';
import { Enemies } from './models/enemy.js';

Meteor.methods({
  'generateNewGame'(accessCode) {
    const gameId = Games.insert({
      accessCode: accessCode,
      state: "waitingForPlayers",
      paused: false,
    });

    return gameId;
  },
  'generateNewPlayer'(gameId, name) {
    const playerId = Players.insert({
      gameId: gameId,
      name: name,
    });

    return playerId;
  },
  'removePlayer'(playerId) {
    Players.remove(playerId);
  },
  'changeGameState'(gameId, state) {
    Games.update(gameId, {$set: {'state': state}});
  },
  //Make random player first turn
  //Set beginning location to HQ
  //Randomly generate each player's stats
  'gameSetup'(gameId) {
    const players = Players.find({gameId: gameId});
    const firstPlayerIndex = Math.floor(Math.random() * players.count());

    players.forEach(function(player, index) {
      Players.update(player._id, {$set: {
        'isTurn': index === firstPlayerIndex,
        'location': 'Headquarters',
        'stats.str': Math.round(50 + 100 * Math.random()),
        'stats.dex': Math.round(50 + 100 * Math.random()),
        'stats.intel': Math.round(50 + 100 * Math.random()),
        'stats.acc': Math.round(60 + 20 * Math.random()),
        'stats.spd': Math.round(80 + 40 * Math.random()),
      }});
      console.log(player)
    });

    Meteor.call('generateNemesis', gameId);
  },

  //Generate enemy Nemesis
  'generateNemesis'(gameId) {
    Enemies.insert({
      gameId: gameId,
      name: 'Bigubosu',
      'location': 'Headquarters',
      'isNemesis': true,
      'stats': {
        'str': Math.round(50 + 100 * Math.random()),
        'dex': Math.round(50 + 100 * Math.random()),
        'intel': Math.round(50 + 100 * Math.random()),
        'acc': Math.round(60 + 20 * Math.random()),
        'spd': Math.round(80 + 40 * Math.random()),
      },
    });
  },
});

function cleanUp() {
  var cutOff = moment().subtract(2, 'hours').toDate().getTime();

  Games.remove({
    createdAt: {$lt: cutOff}
  });

  Players.remove({
    createdAt: {$lt: cutOff}
  });
}

function shuffleArray(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

Games.find({"state": 'settingUp'}).observeChanges({
  added: function(id, game) {
    Meteor.call('gameSetup', id);
    Meteor.call('changeGameState', id, 'inProgress');
  }
});

