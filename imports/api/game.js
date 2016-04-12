import { Meteor } from 'meteor/meteor';
import { Games } from './models/game.js';

import './methods.js';

Games.find({"state": 'settingUp'}).observeChanges({
  added: function(id, game) {
    Meteor.call('gameSetup', id, function(err, res) {
      Meteor.call('changeGameState', id, 'inProgress');
    });
  }
});

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
