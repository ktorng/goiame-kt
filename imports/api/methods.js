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
    let count = Games.findOne(gameId).count
    const playerId = Players.insert({
      gameId: gameId,
      name: name,
      gameTime: count / 1000,
    });
    Games.update(gameId, {$inc: {'count': 1}});

    return playerId;
  },
  'removePlayer'(playerId) {
    Players.remove(playerId);
  },
  'removeEnemy'(enemyId) {
    Enemies.remove(enemyId);
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
    const starterActions = actions_list.filter(function(action) {
      return action.isStarter == true;
    });

    players.forEach(function(player, index) {
      Players.update(player._id, {
        $set: {
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
    let count = Games.findOne(gameId).count
    const nemesisActions = actions_list.filter(function(action) {
      return action.isNemesis == true;
    });

    Enemies.insert({
      gameId: gameId,
      name: 'Nemesis-BIGUBOSU',
      'location': 'Headquarters',
      'gameTime': count / 1000,
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
    Games.update(gameId, {$inc: {'count': 1}});
  },
  
  // Generate enemies at beginning of game
  'generateEnemies'(gameId) {
    let count = Games.findOne(gameId).count
    const starterActions = actions_list.filter(function(action) {
      return action.isStarter == true;
    });
    const playerCount = Players.find({gameId: gameId}).count();

    for (let i = 0; i < playerCount; i++) {
      Enemies.insert({
        gameId: gameId,
        name: 'Slime-' + i,
        'location': 'Headquarters',
        'gameTime': count / 1000,
        'isNemesis': false,
        'actions': starterActions,
        'stats': {
          'currentHealth': 20,
          'maxHealth': 20,
          'str': Math.round(20 + 20 * Math.random()),
          'dex': Math.round(20 + 20 * Math.random()),
          'intel': Math.round(10 + 10 * Math.random()),
          'acc': Math.round(50 + 40 * Math.random()),
          'spd': Math.round(50 + 20 * Math.random()),
        },
      });
    Games.update(gameId, {$inc: {'count': 1}});
    }
  },

  'damageTarget'(currentType, target, damage) {
    if (currentType == 'player') {
      Enemies.update(target._id, {
        $inc: {
          'stats.currentHealth': -damage,
        },
      });
    } else {
      Players.update(target._id, {
        $inc: {
          'stats.currentHealth': -damage,
        },
      });
    }
  },

  'setGameTime'(gameId, time) {
    Games.update(gameId, {
      $set: {
        'gameTime': time,
      }
    });
  },

  'setTurn'(currentType, id) {
    if (currentType == 'player') {
      Players.update(id, {
        $set: {
          'isTurn': true,
        },
      });
    } else {
      Enemies.update(id, {
        $set: {
          'isTurn': true,
        },
      });
    }
  },

  'endTurn'(currentType, current, time) {
    if (currentType == 'player') {
      Players.update(current._id, {
        $inc: {
          'gameTime': time, 
        },
        $set: {
          'isTurn': false,
        },
      });
    } else {
      Enemies.update(current._id, {
        $inc: {
          'gameTime': time, 
        },
        $set: {
          'isTurn': false,
        },
      });
    }
  },

  'pushToLog'(game, string) {
    Games.update(game._id, {
      $push: {
        'log': string,
      },
    });
  },

  'dummy'(){
    console.log('dummy method called');
  }
});

