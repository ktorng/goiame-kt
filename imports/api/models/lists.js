export const actions_list = [
  {
    name: 'attack',
    type: 'melee',
    damage: 10,
    isStarter: true,
    isNemesis: false,
    timeCool: 10,
    timeCharge: 0,
  },
  {
    name: 'move',
    type: 'movement',
    isStarter: true,
    isNemesis: false,
    timeCool: 0,
    timeCharge: 30,
  },
  {
    name: 'nemesisAttack',
    type: 'melee',
    damage: 10,
    isStarter: false,
    isNemesis: true,
    timeCool: 5,
    timeCharge: 0,
  },
  {
    name: 'nemesisMove',
    type: 'movement',
    isStarter: false,
    isNemesis: true,
    timeCool: 0,
    timeCharge: 15,
  },
  {
    name: 'shoot',
    type: 'ranged',
    damage: 8,
    isStarter: true,
    isNemesis: false,
    isRecharged: true,
    timeCool: 0,
    timeCharge: 5,
    timeRecharge: 20,
  },
  {
    name: 'fireball',
    type: 'spell',
    damage: 20,
    isStarter: false,
    isNemesis: false,
    isRecharged: true,
    timeCool: 0,
    timeCharge: 15,
    timeRecharge: 30,
  },
]

export const locations_list = [
  {
    name: 'Headquarters',
  },
  {
    name: 'Library',
  },
  {
    name: 'Police Station',
  },
  {
    name: 'Restaurant',
  },
  {
    name: 'Hospital',
  },
]

export const scenarios_list = [
  {
    name: 'Scenario A',
    description: 'Description A...'
  },
  {
    name: 'Scenario B',
    description: 'Description B...'
  },
  {
    name: 'Scenario C',
    description: 'Description C...'
  },
  {
    name: 'Scenario C',
    description: 'Description C...'
  }
]
