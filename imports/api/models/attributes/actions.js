import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Actions = new SimpleSchema({
  name: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: [
      'melee',
      'ranged',
      'spell',
      'movement',
    ],
  },
  isStarter: {
    type: Boolean,
    defaultValue: false,
  },
  isNemesis: {
    type: Boolean,
    defaultValue: false,
  },
  timeCool: {
    type: Number,
  },
  timeCharge: {
    type: Number,
  },
//  modifiedAt: {
//    type: Date,
//  },
//  events: {
//    beforeChange: function(e) {
//      this.set('modifiedAt', Date.now());
//    }
//  },
//  methods: {
//    incrementStatBy: function(stat, val) {
//      this.inc(stat, val);
//    }
//  }
});
