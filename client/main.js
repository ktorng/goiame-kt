
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

  var gameID = Games.insert(game);
  game = Games.findOne(gameID);

  return game;
}

function trackGameState () {
  var gameID = Session.get("gameID");
  var playerID = Session.get("playerID");

  if (!gameID || !playerID){
    return;
  }

  var game = Games.findOne(gameID);
  var player = Players.findOne(playerID);

  if (!game || !player){
    Session.set("gameID", null);
    Session.set("playerID", null);
    Session.set("currentView", "startMenu");
    return;
  }

  if(game.state === "inProgress"){
    Session.set("currentView", "gameView");
  } else if (game.state === "waitingForPlayers") {
    Session.set("currentView", "lobby");
  }
}

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

Template.createGame.events({
  'submit #create-game': function(event){
    var playerName = event.target.playerName.value;

    if (!playerName || Session.get('loading')) {
      return false;
    }

    var game = generateNewGame();
    var player = generateNewPlayer(game, playerName);

    //Meteor.subscribe('games', game.accessCode);

    Session.set("loading", true);
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
