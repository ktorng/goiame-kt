import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { Games } from '../api/models/game.js'; 
import { Players } from '../api/models/player.js'; 

import './menu.html';
import '../api/methods.js';

Template.body.onCreated(function bodyOnCreated() {
  //Meteor.subscribe('games', function() {
  //  console.log(Games.find().fetch()); 
  //});
});

generateAccessCode = function() {
  let code = "";
  const possible = "abcdefghijklmnopqrstuvwxyz";
  
  for(let i=0; i<5; i++){
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}

/*
generateNewGame = function() {
    let game = {
      accessCode: generateAccessCode(),
      state: "waitingForPlayers",
      paused: false
    };
    gameId = Games.insert(game);

    return Games.findOne(gameId);
}

generateNewPlayer = function(game, name) {
    let player = {
      gameId: game._id,
      name: name,
    };
    playerId = Players.insert(player);

    return Players.findOne(playerId);
}
*/

getAccessLink = function() {
  const game = getCurrentGame();

  if (!game){
    return;
  }

  return Meteor.settings.public.url + game.accessCode + "/";
}

getCurrentPlayer = function() {
  let playerId = Session.get("playerId");

  if(playerId) {
    return Players.findOne(playerId);
  }
}

getCurrentGame = function() {
  let gameId = Session.get("gameId");

  if(gameId) {
    return Games.findOne(gameId);
  }
}

resetUserState = function() {
  let player = getCurrentPlayer();
  if(player) {
    Meteor.call('removePlayer', player._id);
  }
  Session.set("gameId", null);
  Session.set("playerId", null);
}

trackMenuState = function() {
  let gameId = Session.get("gameId");
  let playerId = Session.get("playerId");

  if (!gameId || !playerId){
    return;
  }

  let game = Games.findOne(gameId);
  let player = Players.findOne(playerId);

  
  if (!game && !player){
    Session.set("gameId", null);
    Session.set("playerId", null);
    BlazeLayout.render("main", { content: "startMenu" });
    return;
  }
  

  if (game.state === "inProgress") {
    BlazeLayout.render("main", { content: "gameView" });
    console.log(game.state);
  } else if (game.state === "waitingForPlayers") {
    BlazeLayout.render("main", { content: "lobby" });
    console.log(game.state);
  }
}

leaveGame = function() {
  //GAnalystics.event("game-actions", "gameLeave");
  let player = getCurrentPlayer();
  BlazeLayout.render("main", { content: "startMenu" });
  Meteor.call('removePlayer', player._id);
  Session.set("playerId", null);
}


function hasHistoryApi() {
  return !!(window.history && window.history.pushState);
}

Meteor.setInterval(function() {
  Session.set('time', new Date());
}, 1000);

if(hasHistoryApi()) {
  function trackUrlState() {
    let accessCode = null
    let game = getCurrentGame();
    if(game) {
      accessCode = game.accessCode;
    } else {
      accessCode = Session.get('urlAccessCode');
    }

    let currentURL = '/';
    if(accessCode) {
      currentURL += accessCode + '/';
    }
    window.history.pushState(null, null, currentURL);
  }
  Tracker.autorun(trackUrlState);
}


Tracker.autorun(trackMenuState);

/*
window.onbeforeunload = resetUserState;
window.onpagehide = resetUserState;

FlashMessages.configure({
  autoHide: true,
  autoScroll: false
});
*/

Template.startMenu.events({
  'click #btn-new-game': function(){
    BlazeLayout.render("main", { content: "createGame" });
  },
  'click #btn-join-game': function(){
    BlazeLayout.render("main", { content: "joinGame" });
  }
});

/*
Template.startMenu.rendered = function() {
  //GAnalytics.pageview("/");

  resetUserState();
}
*/

Template.createGame.events({
  'submit #create-game': function(event) {
    event.preventDefault();
    const playerName = event.target.playerName.value;

    if (!playerName || Session.get('loading')) {
      return false;
    }

    const accessCode = generateAccessCode();

    Meteor.call('generateNewGame', accessCode, function(error, gameId) {
      Session.set('gameId', gameId);
      Meteor.call('generateNewPlayer', gameId, playerName, function(error, playerId) {
        Session.set('playerId', playerId);
      });
    });

    Meteor.subscribe('games', accessCode);
    Session.set("loading", true);
      
    setTimeout(function () {
    Meteor.subscribe('players', Session.get('gameId'), function() {
      Session.set("loading", false);
    });
    }, 100);
  },
  'click .btn-back': function(){
    BlazeLayout.render("main", { content: "startMenu" });
  },
});

Template.createGame.helpers({
  isLoading: function(){
    return Session.get('loading');
  },
});

Template.createGame.onRendered(function() {
  $("#player-name").focus();
});

Template.joinGame.events({
  'submit #join-game': function(event){
    //GAnalytics.event("game-actions", "gamejoin");

    let accessCode = event.target.accessCode.value;
    let playerName = event.target.playerName.value;

    if(!playerName || Session.get('loading')) {
      return false;
    }
    
    accessCode = accessCode.trim();
    accessCode = accessCode.toLowerCase();

    Session.set('loading', true);

    Meteor.subscribe('games', accessCode, function() {

      let game = Games.findOne({accessCode: accessCode});
      Session.set('gameId', game._id);
      console.log(game);

      if (game) {
        Meteor.call('generateNewPlayer', game._id, playerName, function(error, playerId) {
          console.log('player joined: ' + playerId);
          Session.set('playerId', playerId);
          Session.set('urlAccessCode', null);
        });
        Meteor.subscribe('players', game._id, function() {
          Session.set('loading', false);
          console.log(Players.findOne());
          BlazeLayout.render("main", { content: "lobby" });
        });
      } else {
        FlashMessages.sendError("invalid access code");
        //GAnalytics.event("game-actions", "invalidcode");
      }
    });
    return false;
  },
  'click .btn-back': function() {
    Session.set('urlAccessCode', null);
    BlazeLayout.render("main", { content: "startMenu" });
    return false;
  }
});

Template.joinGame.helpers({
  isLoading: function() {
    return Session.get('loading');
  }
});

Template.joinGame.onRendered(function() {
  resetUserState();

  let urlAccessCode = Session.get('urlAccessCode');

  if(urlAccessCode) {
    $("#access-code").val(urlAccessCode);
    $("#access-code").hide();
    $("#player-name").focus();
  } else {
    $("#access-code").focus();
  }
});

Template.lobby.helpers({
  game: function() {
    return getCurrentGame();
  },
  accessLink: function() {
    return getAccessLink();
  },
  player: function() {
    return getCurrentPlayer();
  },
  players: function() {
    let game = getCurrentGame();
    let currentPlayer = getCurrentPlayer();

    if(!game) {
      return null;
    }
    
    let players = Players.find({'gameId': game._id}, {'sort': {'createdAt': 1}}).fetch();

    players.forEach(function(player){
      if(player._id === currentPlayer._id){
        player.isCurrent = true;
      }
    });

    return players;
  },
  isLoading: function(){
    let game = getCurrentGame();
    return game.state === 'settingUp';
  }
});


Template.lobby.events({
  'click .btn-leave': leaveGame,
  'click .btn-start': function() {
    //GAnalytics.event("game-actions", "gamestart");

    let game = getCurrentGame();
    Games.update(game._id, {$set: {state: 'settingUp'}});
  },
  'click .btn-remove-player': function() {
    let playerId = $(event.currentTarget).data('player-id');
    Meteor.call('removePlayer', playerId);
  },
  'click .btn-edit-player': function() {
    let game = getCurrentGame();
    resetUserState();
    Session.set('urlAccessCode', game.accessCode);
    BlazeLayout.render("main", { content: "joinGame" });
  },
  'click .session-to-console': function(){
    console.log(Session.get('gameId'));
    console.log(Session.get('playerId'));
    console.log(Games.find(Session.get('gameId')).fetch());
    Players.find().forEach(function (player) {
      console.log(player);
    });
    //console.log(Players.find(Session.get('playerId')).fetch());
  },
});
