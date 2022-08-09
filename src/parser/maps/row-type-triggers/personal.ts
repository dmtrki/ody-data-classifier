export const personalTypesTriggers = {
  itn: {
    has: {
      label: {
        occurs: ['инн'],
      },
      value: [/\d{12}/gm],
    },
  },
  insurance: {
    has: {
      label: {
        occurs: ['снилс'],
      },
      value: [/\d{11}/gm],
    },
  },
  birthLocation: {
    has: {
      label: ['Место рождения', 'Область рождения', 'Район рождения'],
    },
  },
  citizenship: {
    has: {
      label: ['гражданство'],
    },
  },
  nationality: {
    has: {
      label: {
        occurs: ['Национальность'],
      },
    },
  },
  passportSerialNum: {
    has: {
      label: {
        exacts: ['Паспорт', 'Номер документа', 'Паспорт Российский'],
      },
      value: [/^\d{10}$|^\d{4,6}\s\d{4,6}$/],
    },
  },
  passportReleaseDate: [
    {
      has: {
        label: ['Дата выдачи паспорта'],
      },
    },
    {
      has: {
        label: ['Дата выдачи'],
      },
      not: {
        label: [' ПТС', ' ВУ', ' в/у', ' УДОСТОВЕРЕНИЯ', ' РАЗРЕШЕНИЯ'],
      },
    },
  ],
  passportReleaseUnit: [
    {
      has: {
        label: {
          occurs: ['кем выдан'],
          exacts: [
            'Кто выдал',
            'УВД выдачи',
            'Паспорт кем выдан',
            'Наименование органа выдачи',
            'Наименование подразделения',
            'Паспорт выдан',
          ],
        },
      },
    },
  ],
  passportReleaseUnitId: {
    has: {
      label: ['подразделени', 'орган'],
      value: [/^\d{3}-\d{3}|\d{6}$/gm],
    },
  },
}
