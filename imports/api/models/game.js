import { Mongo } from 'meteor/mongo';
import { Astro } from 'meteor/jagi:astronomy';


Games = new Mongo.Collection("games");

Games = Astro.Class({
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
