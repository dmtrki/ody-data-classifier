import {
  moscowResidentsBlockContext,
  movementContext,
} from '../row-type-triggers.map'

export const movementsTypesTriggers = {
  movementFrom: {
    has: {
      label: {
        exacts: ['Адрес от', 'Аэропорт вылета', 'откуда'],
      },
    },
  },
  movementTo: {
    has: {
      label: {
        exacts: ['Адрес до', 'Аэропорт прилета', 'куда'],
      },
    },
  },
  movementVehicleNum: {
    has: {
      label: {
        exacts: ['Номер авто'],
      },
      ...moscowResidentsBlockContext,
    },
  },
  movementSocialCardNum: {},
  movementTroykaCardNum: {
    has: {
      label: 'тройка',
    },
  },
  movementStrelkaCardNum: {
    has: {
      label: 'стрелка',
    },
  },
  movementDirection: {
    has: {
      label: ['направление'],
      ...movementContext,
    },
  },
  movementDate: [
    {
      has: {
        label: {
          exacts: ['дата рейса', 'дата поездки'],
        },
      },
    },
    {
      has: {
        label: ['дата', 'время'],
        ...movementContext,
      },
      not: {
        label: [
          'ввода',
          'ОГРН',
          'рождения',
          'выдачи',
          'завед',
          'пропис',
          'документ',
          'регистр',
          'записи',
          'Учета',
          'договор',
          'актуал',
          'собствен',
          'выписки',
          'НАЧАЛА',
          'ОКОНЧА',
        ],
      },
    },
  ],
  movementIsAeroflot: [
    {
      has: {
        label: 'Аэрофлот',
      },
    },
    {
      has: {
        value: ['аэрофлот'],
      },
    },
  ],
  movementAdditional: {
    has: {
      label: ['авиакомпания', 'номер рейса'],
    },
  },
  movementType: {},
}
