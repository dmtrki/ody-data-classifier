export const relatedPersonsTypesTriggers = {
  relatedFullname: {
    has: {
      label: ['доверенного лица', 'поручителя', 'Связанное лицо'],
    },
    not: {
      label: ['телефон'],
    },
  },
  relatedPhone: [
    {
      has: {
        label: ['доверенного лица', 'поручителя'],
      },
      not: {
        label: ['имя', 'фио', 'ф.и.о'],
      },
    },
    {
      has: {
        label: [
          'Связь с телефоном',
          'Связь с номером',
          'связь с абонентом',
          'телефон поручителя',
        ],
      },
    },
  ],
  relatedBirth: {
    has: {
      label: ['место рождения доверен'],
    },
  },
  relatedAddress: {
    has: {
      label: ['адрес доверен'],
    },
  },
}
