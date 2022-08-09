import {
  ExternalMethodParams,
  ExternalMethodsMap,
} from './types/request-options.interface'
import {
  AvtoFieldsDto,
  EmailFieldsDto,
  ExternalFieldGroup,
  InnFieldsDto,
  InnFlFieldsDto,
  PassportFieldsDto,
  NameFullFieldsDto,
  PhoneFieldsDto,
  SnilsFieldsDto,
  VinFieldsDto,
  NameStandartFieldsDto,
} from './types/odyssey-api-params'
import { EnquiryMetaDto } from '../../enquiry/dtos/enquiry-meta.dto'
import { OdysseyRequestParamsDto } from './dtos/odyssey-request-params.dto'
import {
  isPersonalFields,
  PersonalFieldGroupDto,
} from '../../enquiry/dtos/enquiry-request.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OdysseyParamsFactory {
  private apiMethodsMap: ExternalMethodsMap = {
    personal: {
      path: 'name_standart',
      fields: new NameStandartFieldsDto(),
    },
    phone: {
      path: 'phone',
      fields: new PhoneFieldsDto(),
    },
    email: {
      path: 'email',
      fields: new EmailFieldsDto(),
    },
    passport: {
      path: 'passport',
      fields: new PassportFieldsDto(),
    },
    itn: {
      path: 'inn_fl',
      fields: new InnFlFieldsDto(),
    },
    insurance: {
      path: 'snils',
      fields: new SnilsFieldsDto(),
    },
    plate: {
      path: 'avto',
      fields: new AvtoFieldsDto(),
    },
    vin: {
      path: 'vin',
      fields: new VinFieldsDto(),
    },
    entity: {
      path: 'inn',
      fields: new InnFieldsDto(),
    },
  }
  private internalMethodsSubstitutions = {
    personal: {
      patronymic: 'middlename',
      birth: 'birthday',
    },
    phone: {
      query: 'phone',
    },
    email: {
      query: 'email',
    },
    passport: {
      query: 'passport',
    },
    itn: {
      query: 'inn_fl',
    },
    insurance: {
      query: 'snils',
    },
    plate: {
      query: 'avto',
    },
    vin: {
      query: 'vin',
    },
    entity: {
      query: 'inn',
    },
  }

  make(meta: EnquiryMetaDto): OdysseyRequestParamsDto {
    if (
      !meta?.method ||
      !Object.keys(this.apiMethodsMap).includes(meta.method)
    ) {
      return
    }
    const requestParams = new OdysseyRequestParamsDto(),
      { fields, path } = this.getExternalMethodParams(meta)
    requestParams.body = this.prepareFields(meta, fields)
    requestParams.path = path
    return requestParams
  }

  private getExternalMethodParams({
    method: internalKey,
    fields: { options, ...query },
  }: EnquiryMetaDto): ExternalMethodParams {
    return isPersonalFields(query)
      ? this.resolveOdysseyPersonalParams(query)
      : { ...this.apiMethodsMap[internalKey] }
  }

  private resolveOdysseyPersonalParams(
    fields: Partial<PersonalFieldGroupDto>
  ): ExternalMethodParams {
    if (
      fields.patronymic &&
      fields.birth.search(
        /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.((?:19|20)\d{2})$/im
      ) !== -1
    ) {
      return {
        path: 'name_full',
        fields: new NameFullFieldsDto(),
      }
    }

    return this.apiMethodsMap.personal
  }

  private prepareFields(meta, odysseyFields): ExternalFieldGroup {
    const fields = this.applySubstitutions(meta)

    return { ...odysseyFields, ...fields }
  }

  private getSubstitutions(method) {
    if (this.internalMethodsSubstitutions.hasOwnProperty(method)) {
      return this.internalMethodsSubstitutions[method]
    }
    return null
  }

  private applySubstitutions(meta) {
    const substitutions = this.getSubstitutions(meta.method)
    let fields = meta.fields

    if (substitutions) {
      const substitutionsKeys = Object.keys(substitutions)
      fields = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => {
          if (substitutionsKeys.includes(key)) {
            key = substitutions[key]
          }
          return [key, value]
        })
      )
    }

    return fields
  }
}
