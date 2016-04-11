import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Astro } from 'meteor/jagi:astronomy';
import { Validators } from 'meteor/jagi:astronomy-validators';

import './attributes/stat.js';
import './attributes/modifier.js';


export const Enemies = new Mongo.Collection('enemies');

Enemy = Astro.Class({
  name: 'Enemy',
  collection: Enemies,
  fields: {
    name: {
      type: 'string',
    },
    gameId: {
      type: 'string',
    },
    // image: {
    //   type: 'string',
    //   optional: true
    // },
    location: {
      type: 'string',
    },
    isNemesis: {
      type: 'boolean',
      default: false,
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
