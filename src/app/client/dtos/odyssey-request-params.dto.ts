import {
  ExternalMethodParams,
  ExternalMethodsMap,
  RequestOptionsInterface,
} from '../types/request-options.interface'
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
} from '../types/odyssey-api-params'
import { EnquiryMetaDto } from '../../../enquiry/dtos/enquiry-meta.dto'

export class OdysseyRequestParamsDto implements RequestOptionsInterface {
  body: ExternalFieldGroup
  path: string
  apiMethod: ExternalMethodParams
}
