export const actions_list = [
  {
    name: 'attack',
    type: 'melee',
    isStarter: true,
    timeCool: 10,
    timeCharge: 0
  },
  {
    name: 'move',
    type: 'movement',
    isStarter: true,
    timeCool: 0,
    timeCharge: 30
  },
  {
    name: 'shoot',
    type: 'ranged',
    isStarter: false,
    timeCool: 0,
    timeCharge: 10
  },
  {
    name: 'fireball',
    type: 'spell',
    isStarter: false,
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
