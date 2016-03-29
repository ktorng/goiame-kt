/*
Actions = new Mongo.Collection('actions');

Action = Astro.Class({
  name: 'Action',
  collection: Actions,
  fields: {
    name: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    timeCharge: {
      type: 'number',
      default: 0
    },
    timeCool: {
      type: 'number',
      default: 0
    }
  }
});
*/

actions = [
  {
    name: 'punch',
    type: 'melee',
    timeCool: 10,
    timeCharge: 0
  },
  {
    name: 'shoot',
    type: 'ranged',
    timeCool: 0,
    timeCharge: 10
  },
  {
    name: 'fireball',
    type: 'spell',
    timeCool: 0,
    timeCharge: 30
  },
]

