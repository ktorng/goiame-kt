Template.gameView.onRendered(function() {
  var game = getCurrentGame();
  var player = getCurrentPlayer();
});

Template.gameView.helpers({
  game: function() {
    return getCurrentGame();
  },
  player: function() {
    return getCurrentPlayer();
  },
  players: function() {
    var game = getCurrentGame();
    return Players.find({'gameID': game._id}); 
  },

});
