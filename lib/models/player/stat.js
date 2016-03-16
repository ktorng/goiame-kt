Stats = new Mongo.Collection('stats');

Stat = Astro.Class({
  name: 'Stat',
  collection: Stats,
  fields: {
    str: {
      type: 'number',
      default: 0
    },
    dex: {
      type: 'number',
      default: 0
    },
    intel: {
      type: 'number',
      default: 0
    },
    health: {
      type: 'number',
      default: 100
    },
    meleeDmg: {
      type: 'number',
      default: 10
    },
    rangedDmg: {
      type: 'number',
      default: 8
    },
    spellDmg: {
      type: 'number',
      default: 12
    },
    accuracy: {
      type: 'number',
      default: 10
    },
    modifiedAt: {
      type: 'date',
      validator: [
        Validators.required()
      ]
    }
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
  }
});
