export const commonTypesTriggers = {
  fullname: {
    has: {
      label: {
        occurs: ['имя', 'фамилия', 'фио', 'лицо'],
      },
      value: [/(?:[а-я]{2,}\s){2}[а-я]{2,}/iu],
    },
    not: {
      label: {
        occurs: ['ребенка', 'муниципалитета', 'связанное'],
      },
      context: {
        tags: ['relatedPersons'],
      },
    },
  },
  birth: {
    has: {
      label: {
        occurs: ['дата рождения'],
      },
    },
  },
  death: {
    has: {
      label: ['смерть', 'умер', 'дата смерти', 'скончал'],
    },
  },
  militariable: {
    has: {
      label: ['Военнообязан', 'воинской службе'],
    },
  },
  militaryId: {
    label: ['документ', 'военный'],
    value: [/^[а-я]{2}\d{7}$/iu],
  },
  sex: {
    has: {
      label: {
        exacts: ['пол'],
      },
    },
  },
}
