import { Meteor } from 'meteor/meteor';

import { Games } from './models/game.js';
import { Players } from './models/player.js';


Meteor.publish('players', function(gameID) {
  return Players.find({"gameID": gameID});
});

Meteor.publish('games', function(accessCode) {
  return Games.find({"accessCode": accessCode});
});
