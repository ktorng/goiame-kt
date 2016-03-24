Session.set("currentView", "startMenu");

function generateAccessCode(){
  var code = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";
  
  for(var i=0; i<5; i++){
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}

function generateNewGame(){
    var game = {
      accessCode: generateAccessCode(),
      state: "waitingForPlayers",
      paused: false
    };
    gameID = Games.insert(game);

    return Games.findOne(gameID);
}

function generateNewPlayer(game, name){
    var player = {
      gameID: game._id,
      name: name,
    };
    playerID = Players.insert(player);

    return Players.findOne(playerID);
}

function getCurrentPlayer() {
  var playerID = Session.get("playerID");

  if(playerID) {
    return Players.findOne(playerID);
  }
}

function getCurrentGame() {
  var gameID = Session.get("gameID");

  if(gameID) {
    return Games.findOne(gameID);
  }
}

function resetUserState() {
  var player = getCurrentPlayer();
  if(player) {
    Players.remove(player._id);
  }
  Session.set("gameID", null);
  Session.set("playerID", null);
}

function trackGameState() {
  var gameID = Session.get("gameID");
  var playerID = Session.get("playerID");

  if (!gameID || !playerID){
    return;
  }

  var game = Games.findOne(gameID);
  var player = Players.findOne(playerID);

/*
  if (!game || !player){
    Session.set("gameID", null);
    Session.set("playerID", null);
    Session.set("currentView", "startMenu");
    return;
  }
  */

  //if(game.state === "inProgress"){
  //  Session.set("currentView", "gameView");
  //} else if (game.state === "waitingForPlayers") {
  if (game.state === "waitingForPlayers") {
    Session.set("currentView", "lobby");
  }
}

function leaveGame() {
  //GAnalystics.event("game-actions", "gameLeave");
  var player = getCurrentPlayer();
  Session.set("currentView", "startMenu");
  Players.remove(player._id);
  Session.set("playerID", null);
}

function hasHistoryApi() {
  return !!(window.history && window.history.pushState);
}

Meteor.setInterval(function() {
  Session.set('time', new Date());
}, 1000);

if(hasHistoryApi()) {
  function trackUrlState() {
    var accessCode = null
    var game = getCurrentGame();
    if(game) {
      accessCode = game.accessCode;
    } else {
      accessCode = Session.get('urlAccessCode');
    }

    var currentURL = '/';
    if(accessCode) {
      currentURL += accessCode + '/';
    }
    window.history.pushState(null, null, currentURL);
  }
  Tracker.autorun(trackUrlState);
}
Tracker.autorun(trackGameState);

window.onbeforeunload = resetUserState;
window.onpagehide = resetUserState;

FlashMessages.configure({
  autoHide: true,
  autoScroll: false
});

Template.main.helpers({
  whichView: function(){
    return Session.get('currentView');
  }
});

Template.startMenu.events({
  'click #btn-new-game': function(){
    Session.set("currentView", "createGame");
  },
  'click #btn-join-game': function(){
    Session.set("currentView", "joinGame");
  }
});

Template.startMenu.rendered = function() {
  //GAnalytics.pageview("/");

  resetUserState();
}

Template.createGame.events({
  'submit #create-game': function(event){
    event.preventDefault();
    var playerName = event.target.playerName.value;

    if (!playerName || Session.get('loading')) {
      return false;
    }

    game = generateNewGame();
    player = generateNewPlayer(game, playerName);
    console.log('game and player generated');

    Meteor.subscribe('games', game.accessCode);
    Session.set("loading", true);
      
    Meteor.subscribe('players', game._id, function() {
      console.log('subscribed');
      Session.set("loading", false);
      Session.set("gameID", game._id);
      console.log(Session.get('gameID'));
      Session.set("playerID", player._id);
      console.log(Session.get('playerID'));
    });
  },
  'click .btn-back': function(){
    Session.set("currentView", "startMenu");
    return false;
  }
});

Template.createGame.helpers({
  isLoading: function(){
    return Session.get('loading');
  }
});

Template.createGame.rendered = function(event) {
  $("#player-name").focus();
};

Template.joinGame.events({
  'submit #join-game': function(event){
    //GAnalytics.event("game-actions", "gamejoin");

    var accessCode = event.target.accessCode.value;
    var playerName = event.target.playerName.value;

    if(!playerName || Session.get('loading')) {
      return false;
    }
    
    accessCode = accessCode.trim();
    accessCode = accessCode.toLowerCase();

    Session.set('loading', true);

    Meteor.subscribe('games', accessCode, function() {
      Session.set('loading', false);

      var game = Games.findOne({accessCode: accessCode});

      if(game) {
        Meteor.subscribe('players', game._id);
        player = generateNewPlayer(game, playerName);

        Session.set('urlAccessCode', null);
        Session.set('gameID', game._id);
        Session.set('playerID', player._id);
        Session.set('currentView', 'lobby');
      } else {
        FlashMessages.sendError("invalide access code");
        //GAnalytics.event("game-actions", "invalidcode");
      }
    });
    return false;
  },
  'click .btn-back': function() {
    Session.set('urlAccessCode', null);
    Session.set('currentView', 'startMenu');
    return false;
  }
});

Template.joinGame.helpers({
  isLoading: function() {
    return Session.get('loading');
  }
});

Template.joinGame.rendered = function(event) {
  resetUserState();

  var urlAccessCode = Session.get('urlAccessCode');

  if(urlAccessCode) {
    $("#access-code").val(urlAccessCode);
    $("#access-code").hide();
    $("#player-name").focus();
  } else {
    $("#access-code").focus();
  }
};

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
    var game = getCurrentGame();
    var currentPlayer = getCurrentPlayer();

    if(!game) {
      return null;
    }
    
    var players = Players.find({'gameID': game._id}, {'sort': {'createdAt': 1}}).fetch();

    players.forEach(function(player){
      if(player._id === currentPlayer._id){
        player.isCurrent = true;
      }
    });

    return players;
  },
  isLoading: function(){
    var game = getCurrentGame();
    return game.state === 'settingUp';
  }
});


Template.lobby.events({
  'click .btn-leave': leaveGame,
  'click .btn-start': function() {
    //GAnalytics.event("game-actions", "gamestart");

    var game = getCurrentGame();
    Games.update(game._id, {$set: {state: 'settingUp'}});
  },
  'click .btn-remove-player': function() {
    var playerID = $(event.currentTarget).data('player-id');
    Players.remove(playerID);
  },
  'click .btn-edit-player': function() {
    var game = getCurrentGame();
    resetUserState();
    Session.set('urlAccessCode', game.accessCode);
    Session.set('currentView', 'joinGame');
  }
});
