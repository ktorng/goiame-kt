import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { Games } from '../api/models/game.js'; 
import { Players } from '../api/models/player.js'; 

import './game.html';
import './menu.js';
import '../api/methods.js';

trackGameState = function() {

}

Tracker.autorun(trackGameState);

Template.gameView.onRendered(function() {
  var game = getCurrentGame();
  var player = getCurrentPlayer();
});

Template.gameView.helpers({
  game: function() {
    return getCurrentGame();
  },
  player: function() {
    return getCurrentPlayer();
  },
  players: function() {
    var game = getCurrentGame();
    return Players.find({'gameID': game._id}); 
  },

});

Template.gameView.events({
  'click .btn-leave': leaveGame
});
