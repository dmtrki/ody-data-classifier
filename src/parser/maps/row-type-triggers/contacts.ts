export const contactsTypesTriggers = {
  phoneNum: [
    {
      has: {
        label: ['телефон', 'номер'],
      },
      not: {
        label: [
          'связь',
          'авто',
          'работ',
          'документа',
          'серия',
          'паспорта',
          'полиса',
          'ССП',
          'Кадастровый',
          'Регистр',
          'КМЖ',
          'ДМЖ',
          'БЛАНКА',
          'гоc',
          'УД',
          'РД',
          'дела',
          'статьи',
          'ЕГРП',
        ],
      },
    },
  ],
  phoneDevice: {
    has: {
      label: {
        exacts: ['DeviceModel'],
      },
      context: {
        tags: ['otherSources'],
      },
    },
  },
  homePhone: {
    has: {
      label: 'телефон дом',
    },
  },
  email: {
    has: {
      label: {
        occurs: ['email', 'e-mail'],
      },
    },
  },
  website: {
    has: {
      label: ['сайт'],
    },
  },
  viber: {
    has: {
      label: ['viber'],
    },
  },
  whatsapp: {
    has: {
      label: ['whatsapp'],
    },
  },
  telegram: {
    has: {
      label: {
        exacts: ['telegram id', 'telegram_profile_uid'],
      },
    },
  },
  skype: {
    has: {
      label: {
        occurs: ['skype'],
      },
    },
  },
  vkID: {
    has: {
      label: {
        exacts: ['Алиас'],
      },
      context: {
        tags: ['vk'],
      },
    },
  },
  vkPrivacyStatus: {
    has: {
      label: {
        occurs: ['Приватность'],
      },
      context: {
        tags: ['vk'],
      },
    },
  },
  instagram: {
    has: {
      label: {
        occurs: ['instagram'],
      },
    },
  },
  facebook: {
    has: {
      label: {
        occurs: ['FB UID (fb.com/uid)'],
      },
    },
  },
  twitter: {
    has: {
      label: {
        occurs: ['instagram'],
      },
    },
  },
  possiblePassword: {
    has: {
      label: {
        occurs: ['пароли', 'пароль'],
      },
    },
  },
  nickname: {
    has: {
      label: {
        occurs: ['Логин'],
      },
    },
  },
  trueCaller: {},
  tags: {
    has: {
      label: {
        exacts: [
          'абонент - фамилия ио',
          'имя контакта',
          'ф.и.о. заказчика',
          'ф.и.о. получателя',
          'клиент',
          'в базах',
          'в телефонных книгах',
          'неполное фио',
          'исходное/ФИО',
          'в социальных сетях',
          'на сайтах объявлений',
        ],
      },
    },
  },
}
