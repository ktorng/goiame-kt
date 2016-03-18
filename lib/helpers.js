function cleanUp() {
  var cutOff = moment().subtract(2, 'hours').toDate().getTime();

  Games.remove({
    createdAt: {$lt: cutOff}
  });

  Players.remove({
    createdAt: {$lt: cutOff}
  });
}

function shuffleArray(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

Games.find({"state": 'settingUp'}).observeChanges({
  added: function(id, game) {
    var players = Players.find({gameId: id});
    var firstPlayerIndex = Math.floor(Math.random() * players.count());

    players.forEach(function(player, index) {
      player.set('isFirstPlayer', index === firstPlayerIndex);

      if (player.validate()) {
        player.save();
      }
    })
  }
})
