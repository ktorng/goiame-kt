Enemies = new Mongo.Collection('enemies');

Enemy = Astro.Class({
  name: 'Enemy',
  collection: Enemies,
  fields: {
    name: {
      type: 'string',
    },
    gameID: {
      type: 'string',
    },
    // image: {
    //   type: 'string',
    //   optional: true
    // },
    location: {
      type: 'string'
    },
    stats: {
      type: 'object',
      nested: 'Stat',
      default: function() {
        return {};
      }
    },
    modifiers: {
      type: 'array',
      nested: 'Modifier',
      default: function() {
        return [];
      }
    },
    slug: {
      type: 'string',
      immutable: true,
      validator: [
        Validators.unique(null, 'An enemy with this name already exists.')
      ]
    },
    createdAt: {
      type: 'date',
      immutable: true,
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
      this.createdAt = new Date();
      this.modifiedAt = new Date();
    },
    beforeChange: function() {
      this.modifiedAt = new Date();
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
