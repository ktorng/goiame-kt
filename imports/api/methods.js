import { Meteor } from 'meteor/meteor';

import { Games } from './models/game.js';
import { Players } from './models/player.js';
import { Enemies } from './models/enemy.js';

//import { test_prawn } from '../startup/server/fixtures.js';
import { actions_list } from './models/lists.js';
import { scenarios_list } from './models/lists.js';

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
      gameTime: 0,
    });
    // Add player to turn queue upon creation
    Games.update(
      gameId, {
      $push: {
        'queue': {
          'id': playerId,
          'entity': 'player',
          'time': 0,
        },
      },
    });

    return playerId;
  },
  'removePlayer'(playerId) {
    Players.remove(playerId);
  },
  'removeEnemy'(gameId, enemyId) {
    // Remove from Enemies collection
    Enemies.remove(enemyId);

    const enemyNextInQueue = Games.findOne(gameId).queue[0];
    const enemyInQueue = Games.findOne(gameId).queue.filter(function(e) {
      return e.id == enemyId;
    })[0];

    // Remove from queue
    Games.update(gameId, {
      $pull: { queue: { id: enemyId, entity: 'enemy', time: enemyInQueue.time } }
    });

    // If this enemy would have been next in queue, call nextTurn method
    if (enemyInQueue.id == enemyNextInQueue.id) {
      Meteor.call('nextTurn', gameId);
    }
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
    Meteor.call('nextTurn', gameId);
  },

  // Generate enemy Nemesis
  'generateNemesis'(gameId) {
    const nemesisActions = actions_list.filter(function(action) {
      return action.isNemesis == true;
    });

    const nemesisId = Enemies.insert({
      'gameId': gameId,
      'name': 'Nemesis-BIGUBOSU',
      'location': 'Headquarters',
      'gameTime': 50,
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
    // Add nemesis to turn queue upon creation
    Games.update(
      gameId, {
      $push: {
        'queue': {
          $each: [ { 'id': nemesisId, 'entity': 'enemy', 'time': 50 } ],
          $sort: { 'time': 1 },
        },
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
      let enemyId = Enemies.insert({
        'gameId': gameId,
        'name': 'Slime-' + i,
        'location': 'Headquarters',
        'gameTime': 10,
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
      // Add enemy to turn queue upon creation
      Games.update(
        gameId, {
        $push: {
          'queue': {
            $each: [ { 'id': enemyId, 'entity': 'enemy', 'time': 10 } ],
            $sort: { 'time': 1 },
          },
        },
      });
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

  'setGameTime'(gameId) {
    let minTime = Games.findOne(gameId).queue[0].time;
    Games.update(gameId, {
      $set: {
        'gameTime': minTime,
      },
    });
  },

  'setTurn'(entity, id) {
    if (entity == 'player') {
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

  'endTurn'(gameId, entity, entityId, time) {
    let minTime = Games.findOne(gameId).queue[0].time;
    let newTime = minTime + time;
    try {
      if (entity == 'player') {
        Players.update(entityId, {
          $set: {
            'isTurn': false
          },
        });
      } else {
        Enemies.update(entityId, {
          $set: {
            'isTurn': false
          },
        });
      }
      Games.update(gameId, {
        $pop: {
          'queue': -1
        },
      });
      Games.update(gameId, {
        $push: {
          'queue': {
            $each: [ { id: entityId, entity: entity, time: newTime } ],
            $sort: { time: 1 },
          },
        },
      });
      Meteor.call('nextTurn', gameId);
    } catch(e) {
    }
  },

  'pushToLog'(game, string) {
    Games.update(game._id, {
      $push: {
        'log': string,
      },
    });
  },

  'nextTurn'(gameId) {
    nextTurn =  Games.findOne(gameId).queue[0];
    if (nextTurn.entity == 'player') {
      Meteor.call('setTurn', 'player', nextTurn.id);
    } else {
      Meteor.call('setTurn', 'enemy', nextTurn.id);
    }
  },

  'dummy'(){
    console.log('dummy method called');
  }
});

