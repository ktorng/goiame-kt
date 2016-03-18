Meteor.publish('players', function(gameId) {
  return Players.find({"gameId": gameId});
});

Meteor.publish('games', function(accessCode) {
  return Games.find({"accessCode": accessCode});
});
