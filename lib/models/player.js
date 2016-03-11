Players = new Mongo.Collection('players');

Player = Astro.CLass({
  name: 'Player'
  collection: Players,
  fields: {
    name: {
      type: 'string',
      validator: [
        Validators.required(null, 'Type in a name for your character.'),
        Validators.unique(null, 'A character with this name already exists.'),
        Validators.minLength(3, 'Your character name has to be at least 3 letters.'),
        Validators.maxLength(30, 'Your character name must be less than 30 characters.')
      ]
    },
    age: {
      type: 'number',
    },
    gender: {
      type: 'string',
      optional: true,
      validator: [
        Validators.choice([
          'male',
          'female'
        ])
      ]
    },
    image: {
      type: 'string',
      optional: true
    },
    slug: {
      type: 'string',
      immutable: true,
      validator: [
        Validators.unique(null, 'A character with this name already exists.')
      ]
    },
    createdAt: {
      type: 'date',
      immutable: true
      validator: [
        Validators.required()
      ]
    },
    modifiedAt: {
      type: 'date',
      validator: [
        Validators.required()
      ]
    }
  },
  events: {
    afterInit: function() {
      this.set('createdAt', Date.now());
    }
    afterChange: function(e) {
      if (e.data.fieldName) {
        this.set('modifiedAt', Date.now());
      }
    }
  },
  relations: {
    stat: {
      type: 'one',
      class: 'Stat',
      local: '_id',
      foreign: 'userId'
    },
    modifier: {
      type: 'many',
      class: 'Modifier',
      local: '_id',
      foreign: 'userId'
    }
  },
  methods: {
    generateSlug: function() {
      var self = this;
      Meteor.call('Helpers.generateSlug', this.name, function(err, res) {
        self.set('slug', res);
      });
    }
  }
});
