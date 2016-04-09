import { Meteor } from 'meteor/meteor';

import { Games } from './models/game.js';
import { Players } from './models/player.js';
import { Enemies } from './models/enemy.js';

if (Meteor.isServer) {
  Meteor.publish('games', function(accessCode) {
    return Games.find({"accessCode": accessCode});
  });

  Meteor.publish('players', function(gameId) {
    return Players.find({"gameId": gameId});
  });

  Meteor.publish('enemies', function(gameId) {
    return Enemies.find({"gameId": gameId});
  });
}
