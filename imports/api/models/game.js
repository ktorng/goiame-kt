import { Mongo } from 'meteor/mongo';
import { Astro } from 'meteor/jagi:astronomy';


export const Games = new Mongo.Collection("games");


Game = Astro.Class({
  name: 'Games',
  collection: Games,
  fields: {
    accessCode:{
      type: 'string'
    },
    state:{
      type: 'string'
    },
    paused:{
      type: 'boolean'
    },
    gameTime:{
      type: 'number',
      default: 0
    }
  }
});

