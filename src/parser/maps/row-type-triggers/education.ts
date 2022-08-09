export const educationTypesTriggers = {
  educationInstitution: {
    has: {
      label: {
        occurs: ['Учебы', 'название вуза', 'вуз', 'учебное заведение'],
      },
    },
  },
  educationFaculty: {
    has: {
      label: {
        occurs: ['факультет'],
      },
    },
  },
  educationSpeciality: {
    has: {
      label: {
        occurs: ['специальност'],
      },
    },
  },
  educationForm: [
    {
      has: {
        value: [/очно|заочно/],
      },
    },
    {
      has: {
        label: 'форма обучения',
      },
    },
  ],
  educationDiplomaReleaseDate: {
    has: {
      label: {
        exacts: ['год выпуска', 'год окончания учебного заведения'],
      },
    },
  },
}
