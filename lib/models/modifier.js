Modifiers = new Mongo.Collection('modifiers');

Modifier = Astro.Class({
  name: 'Modifier'
  collection: Modifiers,
  fields: {
    type: {
      type: 'string',
      Validators.choice([
        'Attack Up',
        'Attack Down',
        'Slow'
      ])
    }
    value: {
      type: 'number',
      validator: [
        Validators.required()
      ]
    },
    expireAfterTime: {
      type: 'number',
      validator
    }
    modifiedAt: {
      type: 'date',
      validator: [
        Validators.required()
      ]
    }
  },
  events: {
    afterChange: function(e) {
      this.set('modifiedAt', Date.now());
    }
  },
  methods: {
    incrementStatBy: function(stat, val) {
      this.inc(stat, val);
    }
  }
});
