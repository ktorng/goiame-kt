import { Mongo } from 'meteor/mongo';
import { Astro } from 'meteor/jagi:astronomy';
import { Validators } from 'meteor/jagi:astronomy-validators';

import './attributes/stat.js';
import './attributes/modifier.js';


export const Players = new Mongo.Collection('players');

Player = Astro.Class({
  name: 'Player',
  collection: Players,
  fields: {
    name: {
      type: 'string',
      validator: [
        Validators.required(null, 'Type in a name for your character.'),
        Validators.minLength(3, 'Your character name has to be at least 3 letters.'),
        Validators.maxLength(30, 'Your character name must be less than 30 characters.')
      ]
    },
    gameId: {
      type: 'string',
    },
    age: {
      type: 'number',
      optional: true
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
    isTurn: {
      type: 'boolean'
    },
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
        Validators.unique(null, 'A character with this name already exists.')
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
