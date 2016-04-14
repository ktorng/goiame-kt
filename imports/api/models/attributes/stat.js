import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Stats = new SimpleSchema({
    level: {
      type: Number,
      defaultValue: 1,
    },
    str: {
      type: Number,
      defaultValue: 100,
    },
    dex: {
      type: Number,
      defaultValue: 100,
    },
    intel: {
      type: Number,
      defaultValue: 100,
    },
    currentHealth: {
      type: Number,
      defaultValue: 100,
    },
    maxHealth: {
      type: Number,
      defaultValue: 100,
    },
    def: {
      type: Number,
      defaultValue: 100,
    },
    acc: {
      type: Number,
      defaultValue: 70,
    },
    spd: {
      type: Number,
      defaultValue: 100,
    },
//    modifiedAt: {
//      type: Date,
//    },
//  events: {
//    afterInit: function() {
//      this.modifiedAt = new Date();
//    },
//    beforeChange: function() {
//      this.modifiedAt = new Date();
//    }
//  },
//  methods: {
//    incrementStatBy: function(stat, val) {
//      this.inc(stat, val);
//    }
//  }
});
