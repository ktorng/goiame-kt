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
