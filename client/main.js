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


Tracker.autorun(trackGameState);


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
    console.log('game and plyaer generated');

    Meteor.subscribe('games', game.accessCode);
    Meteor.subscribe('players', game._id)
    console.log('subscribed');

    Session.set("gameID", game._id);
    console.log(Session.get('gameID'));
    Session.set("playerID", player._id);
    console.log(Session.get('playerID'));
    //Session.set("loading", true);

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
