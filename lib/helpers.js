function cleanUp() {
  var cutOff = moment().subtract(2, 'hours').toDate().getTime();

  Games.remove({
    createdAt: {$lt: cutOff}
  });

  Players.remove({
    createdAt: {$lt: cutOff}
  });
}

function generateStats(players) {
  players.forEach(function(player) {
    player.set({
    'stats.str': Math.round(50 + 100 * Math.random()),
    'stats.dex': Math.round(50 + 100 * Math.random()),
    'stats.intel': Math.round(50 + 100 * Math.random()),
    'stats.acc': Math.round(60 + 20 * Math.random()),
    'stats.spd': Math.round(80 + 40 * Math.random())
    });

 //   if (player.validate()) {
      player.save();
 //   }
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
    var players = Players.find({gameID: id});
    var firstPlayerIndex = Math.floor(Math.random() * players.count());

    players.forEach(function(player, index) {
      player.set({
        'isFirstPlayer': index === firstPlayerIndex,
        'location': 'Headquarters'
      });
    

 //     if (player.validate()) {
        player.save();
  //    }
    });

  //  generateStats(players);

    Games.update(id, {$set: {state: 'inProgress'}});
  }
});

