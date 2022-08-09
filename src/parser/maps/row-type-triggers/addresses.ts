export const addressesTypesTriggers = {
  addressResidence: {
    has: {
      label: 'Адрес фактический',
    },
  },
  addressRegistration: {
    AND: [
      {
        has: {
          label: ['адрес'],
        },
      },
      {
        has: {
          label: ['регистр', 'пропис'],
        },
      },
    ],
  },
  addressOther: [
    {
      has: {
        label: ['регион', 'Город/Область', 'Район', 'возможный регион'],
      },
    },
    {
      has: {
        label: ['адрес'],
      },
      not: {
        label: ['фактич', 'регистр'],
      },
    },
  ],
}
