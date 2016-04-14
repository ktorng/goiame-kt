import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const Games = new Mongo.Collection("games");

Games.attachSchema(new SimpleSchema({
  accessCode: {
    type: String,
  },
  log: {
    type: [String],
    defaultValue: [],
  },
  state: {
    type: String,
  },
  paused: {
    type: String,
    defaultValue: false,
  },
  gameTime: {
    type: Number,
    defaultValue: 0,
  },
}));
