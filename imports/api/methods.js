import { Meteor } from 'meteor/meteor';

import { Games } from './models/game.js';
import { Players } from './models/player.js';
import { Enemies } from './models/enemy.js';

//import { test_prawn } from '../startup/server/fixtures.js';
import { actions_list } from './models/lists.js';

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
  // Make random player first turn
  // Set beginning location to HQ
  // Randomly generate each player's stats
  // Generate Nemesis
  'gameSetup'(gameId) {
    const players = Players.find({gameId: gameId});
    const firstPlayerIndex = Math.floor(Math.random() * players.count());
    const starterActions = actions_list.filter(function(action) {
      return action.isStarter == true;
    });

    players.forEach(function(player, index) {
      Players.update(player._id, {
        $set: {
          'isTurn': index === firstPlayerIndex,
          'location': 'Headquarters',
          'actions': starterActions,
          'stats.str': Math.round(50 + 100 * Math.random()),
          'stats.dex': Math.round(50 + 100 * Math.random()),
          'stats.intel': Math.round(50 + 100 * Math.random()),
          'stats.acc': Math.round(60 + 20 * Math.random()),
          'stats.spd': Math.round(80 + 40 * Math.random()),
        },
        //$push: {
        //  'actions': actions_list,
        //}
      });
    });

    Meteor.call('generateNemesis', gameId);
    Meteor.call('generateEnemies', gameId);
  },

  // Generate enemy Nemesis
  'generateNemesis'(gameId) {
    const nemesisActions = actions_list.filter(function(action) {
      return action.isNemesis == true;
    });

    Enemies.insert({
      gameId: gameId,
      name: 'Nemesis-BIGUBOSU',
      'location': 'Headquarters',
      'isNemesis': true,
      'actions': nemesisActions,
      'stats': {
        'str': Math.round(50 + 100 * Math.random()),
        'dex': Math.round(50 + 100 * Math.random()),
        'intel': Math.round(50 + 100 * Math.random()),
        'acc': Math.round(60 + 20 * Math.random()),
        'spd': Math.round(80 + 40 * Math.random()),
      },
    });
  },
  
  // Generate enemies at beginning of game
  'generateEnemies'(gameId) {
    const starterActions = actions_list.filter(function(action) {
      return action.isStarter == true;
    });
    const playerCount = Players.find({gameId: gameId}).count();

    for (let i = 0; i < playerCount; i++) {
      Enemies.insert({
        gameId: gameId,
        name: 'Slime-' + i,
        'location': 'Headquarters',
        'isNemesis': false,
        'actions': starterActions,
        'stats': {
          'str': Math.round(20 + 20 * Math.random()),
          'dex': Math.round(20 + 20 * Math.random()),
          'intel': Math.round(10 + 10 * Math.random()),
          'acc': Math.round(50 + 40 * Math.random()),
          'spd': Math.round(50 + 20 * Math.random()),
        },
      });
    }
  },

  // Do action
  'playerAction'(player, target, damage, time) {
    Enemies.update(target._id, {
      $inc: {
        'stats.currentHealth': -damage,
      },
    });
    Players.update(player._id, {
      $inc: {
        'gameTime': time, 
      },
      $set: {
        'isTurn': false,
      },
    });
  }
});

