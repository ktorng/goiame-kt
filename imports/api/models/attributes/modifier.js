import { Mongo } from 'meteor/mongo';
import { Astro } from 'meteor/jagi:astronomy';
import { Validators } from 'meteor/jagi:astronomy-validators';

Modifiers = new Mongo.Collection('modifiers');

Modifier = Astro.Class({
  name: 'Modifier',
  collection: Modifiers,
  fields: {
    type: {
      type: 'string',
      validator: [
        Validators.choice([
          'Attack Up',
          'Attack Down',
          'Slow'
        ])
      ]
    },
    value: {
      type: 'number',
      validator: [
        Validators.required()
      ]
    },
    expireAfterTime: {
      type: 'number',
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
  /*
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
  */
});
