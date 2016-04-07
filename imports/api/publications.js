import { Meteor } from 'meteor/meteor';

import { Games } from './models/game.js';
import { Players } from './models/player.js';

if (Meteor.isServer) {
  Meteor.publish('players', function(gameId) {
    return Players.find({"gameId": gameId});
  });

  Meteor.publish('games', function(accessCode) {
    return Games.find({"accessCode": accessCode});
  });
}
