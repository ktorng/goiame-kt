Template.gameView.helpers({
  game: getCurrentGame,
  player: getCurrentPlayer,
  players: function() {
    var game = getCurrentGame();
    return Players.find({'gameID': game._id}); 
  },

});
