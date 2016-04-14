export const actions_list = [
  {
    name: 'attack',
    type: 'melee',
    isStarter: true,
    isNemesis: false,
    timeCool: 10,
    timeCharge: 0
  },
  {
    name: 'move',
    type: 'movement',
    isStarter: true,
    isNemesis: false,
    timeCool: 0,
    timeCharge: 30
  },
  {
    name: 'nemesisAttack',
    type: 'melee',
    isStarter: false,
    isNemesis: true,
    timeCool: 5,
    timeCharge: 0
  },
  {
    name: 'nemesisMove',
    type: 'movement',
    isStarter: false,
    isNemesis: true,
    timeCool: 0,
    timeCharge: 15
  },
  {
    name: 'shoot',
    type: 'ranged',
    isStarter: false,
    isNemesis: false,
    timeCool: 0,
    timeCharge: 10
  },
  {
    name: 'fireball',
    type: 'spell',
    isStarter: false,
    isNemesis: false,
    timeCool: 0,
    timeCharge: 30
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
