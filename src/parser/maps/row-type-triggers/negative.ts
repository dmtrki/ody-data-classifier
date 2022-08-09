export const negativeContext = {
  context: {
    tags: ['negative'],
  },
}

export const negativeTypesTriggers = {
  criminalArticle: [
    {
      has: {
        label: ['статья'],
      },
      not: {
        label: ['коап', 'админист'],
      },
    },
  ],
  criminalPart: {
    has: {
      label: ['часть'],
      ...negativeContext,
    },
  },
  criminalPoint: {
    has: {
      label: ['пункт'],
      ...negativeContext,
    },
    not: {
      label: ['Нас'],
    },
  },
  criminalArticleContent: {
    has: {
      label: [
        'содержание статьи',
        'содержание нов.ук',
        'новый ук – прим',
        'содержание стар.ук',
      ],
    },
  },
  criminalDate: {
    has: {
      label: {
        exacts: ['дата осуждения'],
      },
    },
  },
  criminalYear: {
    has: {
      label: ['год осуждения'],
    },
  },
  criminalDateInitiation: {
    has: {
      label: ['дата возбуждения уд'],
    },
  },
  criminalNumber: {
    has: {
      label: ['уголовного дела'],
    },
  },
  criminalNote: {
    has: {
      label: {
        exacts: [
          'комментарии',
          'примечание, примечние',
          'дополнительная информация',
          'информация',
          'инф',
          'описание',
          'причина розыска',
          'приметы',
          'прим',
        ],
      },
      ...negativeContext,
    },
  },
  criminalNickname: {
    has: {
      label: {
        exacts: ['кличка'],
      },
      ...negativeContext,
    },
  },
  criminalSigns: {
    has: {
      label: {
        exacts: ['приметы'],
      },
    },
  },
  administrativeResponsibility: {
    has: {
      label: ['административ', 'адм.практика', 'нарушения', 'КОАП'],
    },
  },
  executiveProcedureInitiatorOsp: {
    AND: [
      {
        has: {
          label: ['инициатор'],
        },
      },
      {
        has: {
          label: ['осп'],
        },
      },
    ],
  },
  executiveProcedureBaseIp: {
    has: {
      label: ['исп. пр-во', 'основание ип', 'основание ип'],
    },
  },
  executiveProcedureDebt: {
    has: {
      label: [
        'сумма долга',
        'сумма_долга_руб',
        'сумма долга руб',
        'сумма задолженности',
      ],
    },
  },
  executiveProcedureNumber: {
    has: {
      label: ['номер_ип', 'номер ип', 'номер ид'],
    },
  },
  executiveProcedureOffenseType: {
    has: {
      label: ['вид правонарушения'],
    },
  },
  executiveProcedureResolution: {
    has: {
      label: ['орган вынесший постановление'],
    },
  },
  executiveProcedurePunishment: {
    has: {
      label: ['наказание'],
    },
  },
  executiveProcedureDate: {
    has: {
      label: {
        exacts: ['дата возбуждения ип', 'дата совершения'],
      },
    },
  },
  wantedDateStart: {
    AND: [
      {
        has: {
          label: ['заведения рд', 'розыск', ' фр', ' уд', 'пост. в гиц'],
        },
      },
      {
        has: {
          label: ['дата'],
        },
      },
    ],
  },
  wantedFable: {
    has: {
      label: ['фабула'],
      ...negativeContext,
    },
  },
  wantedBasis: {
    has: {
      label: {
        exacts: [
          'статья ук инициатора',
          'мера пресечения',
          'циркуляр розыска',
          'причина розыска',
          'статья',
          'статья ук, статья, статья ук',
          'категория',
          'основания розыска',
          'причина розыска',
          'статья ук - инициатор',
        ],
      },
    },
  },
  wantedSearchType: {
    has: {
      label: {
        exacts: ['вид розыска', 'тип розыска'],
      },
    },
  },
  wantedSearchCategory: {
    has: {
      label: {
        exacts: ['категория розыска'],
      },
    },
  },
  wantedPreventiveMeasure: {
    has: {
      label: {
        exacts: ['мера пресечения', 'мера'],
      },
    },
  },
  wantedSearchInitiator: {
    has: {
      label: {
        exacts: [
          'инициатор розыска',
          'подразделение объявившее в розыск',
          'инициатор',
        ],
      },
    },
  },
  wantedDateStartCriminal: {
    has: {
      label: {
        exacts: ['дата возбуждения уд'],
      },
    },
  },
  wantedDateEndCriminal: {
    has: {
      label: {
        exacts: ['дата приостановления уд'],
      },
    },
  },
  wantedDateTerminationSearch: {
    has: {
      label: {
        exacts: ['дата приостановления', 'дата прекращения розыска'],
      },
    },
  },
  wantedArmed: {
    has: {
      label: {
        exacts: ['вооружен', 'вооружен (да/нет)'],
      },
    },
  },
  wantedPreviouslyJudged: {
    has: {
      label: {
        exacts: ['ранее судим'],
      },
    },
  },
  wantedNote: {
    has: {
      label: {
        exacts: [
          'дополнительная информация',
          'фабула',
          'информация',
          'инф',
          'описание',
          'причина розыска',
          'приметы',
          'прим',
        ],
      },
    },
  },
  blacklistNote: {
    has: {
      label: {
        exacts: [
          'фабула',
          'комментарии',
          'информация',
          'доп инф',
          'примечание',
          'состоит в опг',
          'категория',
          'инф',
          'справка',
          'прим',
          'информация по лицу',
          'источник',
        ],
      },
      context: {
        tags: ['negative'],
      },
    },
  },
  specialAccounting: {
    has: {
      label: {
        exacts: [
          'то',
          'что нужно забирать: справка',
          'фабула',
          'комментарии, примечание',
          'инф',
          'прим',
          'информация по лицу',
          'тип учета. справка',
          'дополнительная информация',
          'фабула',
          'информация',
          'описание',
          'причина розыска',
          'приметы',
          'прим',
        ],
      },
    },
  },
  specialPunishment: {
    has: {
      label: {
        exacts: ['наказание'],
      },
    },
  },
}
