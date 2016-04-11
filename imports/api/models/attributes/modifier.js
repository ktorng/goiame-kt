import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Modifiers = new SimpleSchema({
  type: {
    type: 'string',
    allowedValues: [
      'Defense Down',
      'Defense Down',
      'Slow',
    ],
  },
  value: {
    type: Number,
  },
  expireAfterTime: {
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
