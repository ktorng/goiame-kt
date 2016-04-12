import { Meteor } from 'meteor/meteor';

import { Games } from '../../api/models/game.js';
import { Players } from '../../api/models/player.js';

export const test_prawn = []

var actions_list = [
  {
    name: 'attack',
    type: 'melee',
    timeCool: 10,
    timeCharge: 0
  },
  {
    name: 'shoot',
    type: 'ranged',
    timeCool: 0,
    timeCharge: 10
  },
  {
    name: 'fireball',
    type: 'spell',
    timeCool: 0,
    timeCharge: 30
  },
]

var locations_list = [
  {
    name: 'Headquarters',
  },
  {
    name: 'Library',
  },
  {
    name: 'Police Station',
  },
  {
    name: 'Restaurant',
  },
  {
    name: 'Hospital',
  },
]

Meteor.startup(function() {
  // Delete all games and players at startup
  Games.remove({});
  Players.remove({});
});


// generation functions can be used to have a more predefined and predictable game, trading randomized stats for more consistency

Meteor.methods({
  'Database.seed': function() {
    var monsters = [
      'Monster 1',
      'Monster 2',
      'Monster 3'
    ];

    _.forEach(monsters, function(m) {
      varmonster = new Monster();

      monster.set({
        name: m,
        createdAt: new Date(),
      });

      // monster.generateStats();

      if (monster.validate()) {
        monster.save();
      }
    });

    var locations = [
      'Location 1',
      'Location 2',
      'Location 3'
    ];

    _.forEach(locations, function(l) {
      var location = new Location();

      location.set({
        name: l,
        createdAt: new Date(),
      });

      // location.generateAttributes();

      if (location.validate()) {
        location.save();
      }
    });

    var items = [
      'Item 1',
      'Item 2',
      'Item 3',
    ];

    _.forEach(items, function(i) {
      var item = new Item();

      item.set({
        name: i,
        createdAt: new Date(),
      });

      // item.generateAttributes();

      if (item.validate()) {
        item.save();
      }
    })
  }
});
