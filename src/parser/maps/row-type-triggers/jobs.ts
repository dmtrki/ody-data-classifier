import { notMoscowResidents } from '../row-type-triggers.map'

export const jobsTypesTriggers = {
  jobEmployerTitle: {
    has: {
      label: ['работодатель', 'место работы', 'Огранизация', 'компания'],
    },
    not: {
      label: ['учебы'],
    },
  },
  jobEmployerItn: [
    {
      has: {
        label: ['ИНН'],
        value: [/\d{10}/gm],
        context: {
          tags: ['finances', 'employer'],
        },
      },
      ...notMoscowResidents,
    },
    {
      has: {
        label: ['ИНН ЮЛ', 'ИНН ИП'],
        context: {
          tags: ['finances', 'employer'],
        },
      },
    },
  ],
  jobEmployerAddress: {
    has: {
      label: {
        occurs: ['Адрес работы'],
      },
    },
    ...notMoscowResidents,
  },
  jobEmployerPhone: {
    AND: [
      {
        has: {
          label: ['раб'],
        },
      },
      {
        has: {
          label: ['Тел'],
        },
      },
      { ...notMoscowResidents },
    ],
  },
  jobEmployerManagersPhone: {
    has: {
      label: ['Телефон директора', 'телефон менеджера'],
    },
  },
  jobEmployerAccountantsPhone: {
    has: {
      label: ['Телефон бухгалтера'],
    },
  },
  jobTitle: {
    has: {
      label: ['Должност'],
    },
  },
  jobRelatedPersons: {
    has: {
      label: ['коллеги'],
    },
  },
  jobIncomeSum: {
    has: {
      label: ['Сумма дохода'],
      context: {
        tags: ['finances'],
      },
    },
  },
  jobIncomeDate: {
    has: {
      label: ['Дата'],
      context: {
        tags: ['finances'],
      },
    },
    not: {
      label: ['рождения', 'паспорт', 'документ', 'регистрации'],
    },
  },
  additionalIncome: {
    has: {
      label: {
        exacts: [
          'сумма дивидендов',
          'сумма других доходов',
          'облагаемая сумма других доходов',
        ],
      },
    },
  },
}
