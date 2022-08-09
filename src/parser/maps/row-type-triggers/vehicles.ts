import {
  moscowResidentsBlockContext,
  notMoscowResidents,
} from '../row-type-triggers.map'

export const vehiclesTypesTriggers = {
  driversLicenseNum: [
    {
      has: {
        label: ['Водительское удостоверение'],
      },
    },
    {
      AND: [
        {
          has: {
            label: {
              occurs: ['ву', 'в\\у', 'водительско'],
            },
          },
        },
        {
          has: {
            label: {
              occurs: ['номер'],
            },
          },
        },
      ],
    },
  ],
  driversLicenseReleaseDate: {
    AND: [
      {
        has: {
          label: ['в/у', 'ВУ', 'водительско', 'удостоверен'],
        },
      },
      {
        has: {
          label: ['Дата'],
        },
      },
    ],
  },
  driversLicenseCategory: {
    has: {
      label: ['категория'],
      context: {
        tags: ['auto'],
      },
    },
    not: {
      context: {
        tags: ['scoring', 'negative'],
      },
    },
  },
  vehicleNum: [
    {
      has: {
        label: ['авто', 'госномер', 'гос.номер', 'Гос. номер'],
        context: {
          tags: ['auto'],
        },
      },
      not: {
        label: ['старый', 'Информация'],
        ...moscowResidentsBlockContext,
      },
    },
    {
      has: {
        value: [/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/mu],
      },
      not: {
        label: ['карта', 'старый'],
        ...moscowResidentsBlockContext,
      },
    },
  ],
  vehicleNumOutdated: {
    AND: [
      {
        has: {
          label: ['авто', 'госномер', 'гос.номер', 'Гос. номер'],
          context: {
            tags: ['auto'],
          },
        },
      },
      {
        has: {
          label: ['старый'],
        },
      },
    ],
  },
  vehicleVin: [
    {
      has: {
        label: 'VIN',
      },
    },
    {
      has: {
        value: [/^[0123456789ABCDEFGHJKLMNPRSTUVWXYZ]{17}$/i],
        context: {
          tags: ['auto'],
        },
      },
    },
  ],
  vehicleRelatedPersons: {
    has: {
      label: ['доверенного лица'],
    },
  },
  vehicleBrandModel: {
    has: {
      label: {
        exacts: ['Модель/марка', 'Информация о авто'],
      },
    },
  },
  vehicleBrand: {
    has: {
      label: 'Марка',
    },
  },
  vehicleModel: {
    has: {
      label: {
        exacts: ['Модель'],
      },
    },
  },
  vehicleColor: {
    has: {
      label: 'цвет',
    },
  },
  vehicleReleaseYear: {
    has: {
      label: {
        exacts: ['Год выпуска', 'год тс'],
      },
    },
  },
  vehiclePassport: {
    has: {
      label: {
        occurs: ['птс'],
      },
    },
    not: {
      label: ['дата', 'когда'],
    },
  },
  vehicleRegistrationDate: {
    AND: [
      {
        has: {
          label: ['когда', 'дата выдачи'],
        },
        not: {
          label: ['паспорт'],
        },
      },
      {
        has: {
          label: ['учет', 'регистраци', 'ПТС'],
        },
      },
      {
        has: {
          context: {
            tags: ['auto'],
          },
        },
        not: {
          label: ['снятия'],
        },
      },
    ],
  },
  vehicleDeregistrationDate: {
    AND: [
      {
        has: {
          label: ['когда', 'дата', 'снятия'],
        },
        not: {
          label: ['паспорт'],
        },
      },
      {
        has: {
          label: ['снятия'],
        },
      },
      {
        has: {
          context: {
            tags: ['auto'],
          },
        },
      },
    ],
  },
  vehicleRegistrationCertificateNum: {
    has: {
      label: {
        occurs: ['стс'],
      },
    },
  },
  vehicleInsuranceAgent: {
    has: {
      label: {
        exacts: ['Страховщик'],
      },
      context: {
        tags: ['auto'],
      },
    },
  },
  vehicleInsuranceNum: {
    has: {
      context: {
        tags: ['auto'],
      },
      label: {
        occurs: ['полис', 'ОСАГО'],
      },
    },
    not: {
      label: {
        occurs: ['статус'],
      },
    },
  },
  vehicleInsuranceStatus: {
    has: {
      label: 'Статус полиса',
    },
  },
  vehicleRestriction: [
    {
      has: {
        label: ['Ограничения'],
        context: {
          tags: ['auto'],
        },
      },
    },
  ],
  vehicleOwnerFullname: {
    has: {
      label: ['фио владельца'],
    },
  },
}
