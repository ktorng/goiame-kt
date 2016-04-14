import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { Games } from '../api/models/game.js'; 
import { Players } from '../api/models/player.js'; 
import { Enemies } from '../api/models/enemy.js';

import './game.html';
import './helpers.js';
import '../api/methods.js';

trackGameState = function() {

}

Tracker.autorun(trackGameState);

Template.body.onCreated(function bodyOnCreated() {
  //Meteor.subscribe('games', function() {
  //  console.log(Games.find().fetch()); 
  //});
});

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

Template.gameButtons.events({
  'click .btn-status': function () {
    BlazeLayout.render("main", { content: "gameView", footer: "gameButtons" });
  },
  'click .btn-character': function () {
    BlazeLayout.render("main", { content: "character", footer: "gameButtons" });
  },
  'click .btn-targets': function () {
    BlazeLayout.render("main", { content: "targets", footer: "gameButtons" });
  },
  'click .btn-inventory': function () {
   console.log(Players.findOne());
   console.log(Enemies.find().fetch());
  },
  'click .btn-game-menu': function () {
    BlazeLayout.render("main", { content: "gameMenu" });
  },
});

Template.gameMenu.events({
  'click .btn-leave': leaveGame,
  'click .btn-instructions': function () {
    BlazeLayout.render("main", { content: "instructions" });
  },
  'click .btn-back': function () {
    BlazeLayout.render("main", { content: "gameView", footer: "gameButtons" });
  },
});

Template.instructions.events({
  'click .btn-back': function () {
    BlazeLayout.render("main", { content: "gameView", footer: "gameButtons" });
  },
});

Template.character.helpers({
  game() {
    return getCurrentGame();
  },
  player() {
    return getCurrentPlayer();
  },
  players() {
    var game = getCurrentGame();
    return Players.find({'gameId': game._id}); 
  },
});

Template.targets.helpers({
  game() {
    return getCurrentGame();
  },
  enemy() {
    return Enemies.findOne(this._id);
  },
  enemies() {
    const game = getCurrentGame();
    return Enemies.find({'gameId': game._id}); 
  },
  nemesis() {
    return Enemies.findOne();
  },
  selectedClass() {
    const selectedEnemy = Session.get('selectedEnemy');
    if (this._id == selectedEnemy) {
      return "selected"
    }
  },
  isSelectedEnemy() {
    return this._id === Session.get('selectedEnemy');
  },
  playerTimeReq() {
    return actionTimeReq('player', Session.get('selectedAction'))[1];  
  },
  coolOrCharge() {
    return actionTimeReq('player', Session.get('selectedAction'))[0];  
  },
});

Template.targets.events({
  'click .enemy'() {
    Session.set('selectedEnemy', this._id);
  },
  'click .btn-attack'() {
    Session.set('selectedAction', 'attack');
    $('#attack-modal').modal();
  },
  'click #confirm-attack'() {
    let player = getCurrentPlayer();
    let target = this;

  },
});
