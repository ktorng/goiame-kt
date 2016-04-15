import { Meteor } from 'meteor/meteor';

import { Games } from '../api/models/game.js';
import { Players } from '../api/models/player.js';
import { Enemies } from '../api/models/enemy.js';


if (Meteor.isClient) {
  Meteor.setInterval(function() {
    Session.set('time', new Date());
  }, 1000);
}

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

// Calculate damage of action
// current includes str/dex/int and random factor
// need modifiers later on
calcDamage = function(current, baseDamage, type) {
  const meleeStat = (current.stats.str + 0.5 * current.stats.dex)/100;
  const rangedStat = (0.5 * current.stats.str + current.stats.dex)/100;
  const spellStat = current.stats.intel/100;
  const randomFactor = 0.9 + 0.2 * Math.random();
  if (type == 'melee') {
    return Math.round(baseDamage * meleeStat * randomFactor);
  } else if (type == 'ranged') {
    return Math.round(baseDamage * rangedStat * randomFactor);
  } else if (type == 'spell') {
    return Math.round(baseDamage * spellStat * randomFactor);
  }
}

// Calculate time to do action
// current includes spd factor and random factor
// need modifiers later on
calcTimeReq = function(current, baseTime) {
  const spdStat = 100/current.stats.spd;
  const randomFactor = Math.random() - 0.5;
  return Math.round(baseTime * spdStat + randomFactor);
}

// Calculate time to do action
// for confirm attack window approx
calcTimeReqNoRand = function(player, baseTime) {
  const spdStat = 100/player.stats.spd;
  return Math.round(baseTime * spdStat);
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
    timeReq = calcTimeReqNoRand(current, action.timeCool);
  } else {
    coolOrCharge = 'charge';
    timeReq = calcTimeReqNoRand(current, action.timeCharge);
  }

  return [coolOrCharge, timeReq];
}

moveHealthBar = function(enemy, percent) {
  var elem = document.getElementById("health-bar " + enemy);
  var width = 10;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
//      document.getElementById("label").innerHTML = width * 1  + '%';
    }
  }
}

// Find min of all player and enemy gameTimes
findMinGameTime = function(gameId) {
  minPlayer = Players.find({gameId: gameId}, {sort: {'gameTime': 1}}, {limit: 1}).fetch()[0];
  minEnemy = Enemies.find({gameId: gameId}, {sort: {'gameTime': 1}}, {limit: 1}).fetch()[0];
  return Math.min(minPlayer.gameTime, minEnemy.gameTime);
}

shuffleArray = function(a) {
  let j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}
