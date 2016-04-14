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
  isStart() {
    const game = getCurrentGame();
    return game.gameTime == 0; 
  },
  game: function() {
    return getCurrentGame();
  },
  player: function() {
    return getCurrentPlayer();
  },
});

Template.gameStatus.helpers({
  game: function() {
    return getCurrentGame();
  },
  player: function() {
    return getCurrentPlayer();
  },
});

Template.gameButtons.events({
  'click .btn-status': function () {
    BlazeLayout.render("main", {
      top: "gameStatus",
      content: "gameView",
      footer: "gameButtons",
    });
  },
  'click .btn-character': function () {
    BlazeLayout.render("main", {
      top: "gameStatus",
      content: "character",
      footer: "gameButtons",
    });
  },
  'click .btn-targets': function () {
    BlazeLayout.render("main", {
      top: "gameStatus",
      content: "targets",
      footer: "gameButtons",
    });
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
    const player = getCurrentPlayer();
    return Enemies.find({'gameId': game._id, 'location': player.location}); 
  },
  healthPercent() {
    const target = Enemies.findOne(this._id);
    return Math.round(target.stats.currentHealth / target.stats.maxHealth);
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
  isInspectedEnemy() {
    return this._id === Session.get('inspectedEnemy');
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
  'click .btn-inspect'() {
    Session.set('inspectedEnemy', this._id);
    console.log(Enemies.findOne(this._id));
  },
  'click .btn-attack'() {
    Session.set('selectedAction', 'attack');
    $('#attack-modal').modal();
  },
  'click #confirm-attack'() {
    $('#attack-modal').modal('hide');
    let player = getCurrentPlayer();
    let target = this;
    const attack = getActionByName(player.actions, 'attack'); 
    const attackTime = calcTimeReq(player, attack.timeCool);
    const attackDamage = calcDamage(player, attack.damage, attack.type);

    Meteor.call('damageTarget', target, attackDamage);
    Meteor.call('endTurn', player, attackTime);
//    Meteor.call('playerAction', player, target, attackDamage, attackTime, function(err, res) {
//      moveHealthBar(target.name, 50); 
//    });
//    console.log(player);
//    console.log(target);
//    console.log(attack);
//    console.log(attackTime);
//    console.log(attackDamage);
  },
});
