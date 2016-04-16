import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import './attributes/actions.js';
import './attributes/stat.js';
import './attributes/modifier.js';


export const Players = new Mongo.Collection('players');

Players.attachSchema(new SimpleSchema({
  name: {
    type: String,
    min: 3,
    max: 10,
  },
  gameId: {
    type: String,
  },
  age: {
    type: Number,
    optional: true,
  },
  gameTime: {
    type: Number,
    defaultValue: 0,
    decimal: true,
  },
  gender: {
    type: String,
    optional: true,
    allowedValues: [
      'male',
      'female'
    ],
  },
  image: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    defaultValue: 'waiting',
  },
  isTurn: {
    type: Boolean,
    defaultValue: false,
  },
  location: {
    type: String,
    optional: true,
  },
  actions: {
    type: [Actions],
    defaultValue: [],
  },
  stats: {
    type: Stats,
    defaultValue: {},
  },
  modifiers: {
    type: [Modifiers],
    defaultValue: [],
    optional: true,
  },
  slug: {
    type: String,
    optional: true,
  },
  // Force value to be current date upon insert
  // and prevent updates thereafter
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
  },
  // Force value to be current date upon update
  // and don't allow it to be set upon insert
  updatedAt: {
   type: Date,
   autoValue: function() {
    if (this.isUpdate) {
      return new Date();
    }
   },
   denyInsert: true,
   optional: true,
  },
//  events: {
//    afterInit: function() {
//      this.createdAt = new Date();
//      this.modifiedAt = new Date();
//    },
//    beforeChange: function() {
//      this.modifiedAt = new Date();
//    }
//  },
//  methods: {
//    generateSlug: function() {
//      var self = this;
//      Meteor.call('Helpers.generateSlug', this.name, function(err, res) {
//        self.set('slug', res);
//      });
//    }
//  }
}));
