import { Meteor } from 'meteor/meteor';

import { Games } from './models/game.js';
import { Players } from './models/player.js';
import { Enemies } from './models/enemy.js';

import './methods.js';
import '../ui/helpers.js';

if (Meteor.isServer) {
  Games.find( { "state": 'settingUp' } ).observeChanges({
    added: function(id, game) {
      Meteor.call('gameSetup', id, function(err, res) {
        Meteor.call('changeGameState', id, 'inProgress');
      });
    }
  });
}

// Remove enemy when dead
Enemies.find( { "stats.currentHealth": { $lte: 0 } } ).observe({
  added: function(enemy) {
    Meteor.call('pushToLog', Games.findOne(enemy.gameId), enemy.name + ' was defeated!'); 
    Meteor.call('removeEnemy', enemy._id);
  }
});

// Enemy turn
Enemies.find( { "isTurn": true } ).observe({
  added: function(enemy) {
    // If there are players in current location, choose one  
    playersInLocation = Players.find({'gameId': enemy.gameId, 'location': enemy.location}).fetch();
    if (playersInLocation.length > 0) {
      chosenTarget = shuffleArray(playersInLocation)[0];

      // Choose an action 
      availableActions = enemy.actions.filter(function(a) {
        //return a.type != 'movement';
        return a.type == 'melee';
      });
      chosenAction = shuffleArray(availableActions)[0];

      let game = Games.findOne(enemy.gameId);
      const attackTime = calcTimeReq(enemy, chosenAction.timeCool);
      const attackDamage = calcDamage(enemy, chosenAction.damage, chosenAction.type);
      const log = 'Day ' + Math.round(enemy.gameTime) + ': ' + enemy.name + ' attacked '
        + chosenTarget.name + ' for ' + attackDamage + ' damage!';

      Meteor.call('pushToLog', game, log);
      Meteor.call('damageTarget', 'enemy', chosenTarget, attackDamage);
      Meteor.call('endTurn', 'enemy', enemy, attackTime);

    } else {
      availableActions = enemy.actions.filter(function(a) {
        return a.type == 'movement';
      });
    }
  }
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
