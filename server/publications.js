Meteor.publish('players.all', function() {
  return Players.find();
});
