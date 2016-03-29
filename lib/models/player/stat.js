Stats = new Mongo.Collection('stats');

Stat = Astro.Class({
  name: 'Stat',
  collection: Stats,
  fields: {
    str: {
      type: 'number',
      default: 100
    },
    dex: {
      type: 'number',
      default: 100
    },
    intel: {
      type: 'number',
      default: 100
    },
    health: {
      type: 'number',
      default: 100
    },
    /*
    meleeDmg: {
      type: 'number',
      default: 50
    },
    rangedDmg: {
      type: 'number',
      default: 40
    },
    spellDmg: {
      type: 'number',
      default: 80
    },
    */
    acc: {
      type: 'number',
      default: 70
    },
    spd: {
      type: 'number',
      default: 100
    },
    modifiedAt: {
      type: 'date',
      validator: [
        Validators.required()
      ]
    }
  /*
  },
  events: {
    afterChange: function(e) {
      this.set('modifiedAt', Date.now());
    }
  },
  methods: {
    incrementStatBy: function(stat, val) {
      this.inc(stat, val);
    }
  */
  }
});
