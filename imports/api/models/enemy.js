import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import './attributes/actions.js';
import './attributes/stat.js';
import './attributes/modifier.js';


export const Enemies = new Mongo.Collection('enemies');

Enemies.attachSchema(new SimpleSchema({
  name: {
    type: String,
  },
  gameId: {
    type: String,
  },
  image: {
    type: String,
    optional: true,
  },
  gameTime: {
    type: Number,
    defaultValue: 10,
    decimal: true,
  },
  location: {
    type: String,
  },
  isTurn: {
    type: Boolean,
    defaultValue: false,
  },
  isNemesis: {
    type: Boolean,
    defaultValue: false,
  },
  actions: {
    type: [Actions],
    defaultValue: [],
  },
  stats: {
    type: Stats,
    defaultValue: function() {
      return {};
    }
  },
  modifiers: {
    type: [Modifiers],
    optional: true,
  },
  slug: {
    type: String,
    optional: true,
//    immutable: true,
//    validator: [
//      Validators.unique(null, 'An enemy with this name already exists.')
//    ]
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
