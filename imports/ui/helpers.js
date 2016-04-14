import { Meteor } from 'meteor/meteor';

import { Games } from '../api/models/game.js'; 
import { Players } from '../api/models/player.js'; 
import { Enemies } from '../api/models/enemy.js'; 


Meteor.setInterval(function() {
  Session.set('time', new Date());
}, 1000);

generateAccessCode = function() {
  let code = "";
  const possible = "abcdefghijklmnopqrstuvwxyz";
  
  for(let i=0; i<5; i++){
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}

getAccessLink = function() {
  const game = getCurrentGame();

  if (!game){
    return;
  }

  return Meteor.settings.public.url + game.accessCode + "/";
}

getCurrentEnemy = function() {
  const enemyId = Session.get("enemyId");

  if(enemyId) {
    return Enemies.findOne(enemyId);
  }
}

getCurrentPlayer = function() {
  const playerId = Session.get("playerId");

  if(playerId) {
    return Players.findOne(playerId);
  }
}

getCurrentGame = function() {
  const gameId = Session.get("gameId");

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

leaveGame = function() {
  //GAnalystics.event("game-actions", "gameLeave");
  let player = getCurrentPlayer();
  BlazeLayout.render("main", { content: "startMenu" });
  Meteor.call('removePlayer', player._id);
  Session.set("playerId", null);
}

hasHistoryApi = function() {
  return !!(window.history && window.history.pushState);
}

getActionByName = function(list, name) {
	return list.filter(
    function(e) {
      return e.name == name
    }
  )[0];
}

// Returns an array that specifies whether action is a charge or cool
// and how much time it requires
actionTimeReq = function(playerOrEnemy, actionName) {
  let current;
  let coolOrCharge;
  let timeReq;

  if (playerOrEnemy == 'player') {
    current = getCurrentPlayer(); 
  } else {
    current = getCurrentEnemy();
  }

  const action = getActionByName(current.actions, actionName);

  if (action.timeCool != 0) {
    coolOrCharge = 'cooldown';
    timeReq = action.timeCool;
  } else {
    coolOrCharge = 'charge';
    timeReq = action.timeCharge;
  }
  
  return [coolOrCharge, timeReq];
}
