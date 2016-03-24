Meteor.startup(function() {
  // Delete all games and players at startup
  Games.remove({});
  Players.remove({});
});

Meteor.methods({
});
