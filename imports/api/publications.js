Meteor.publish('players', function(gameID) {
  return Players.find({"gameID": gameID});
});

Meteor.publish('games', function(accessCode) {
  return Games.find({"accessCode": accessCode});
});
