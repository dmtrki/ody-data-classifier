import {
  EmailRequestDto,
  EntityRequestDto,
  InsuranceRequestDto,
  ItnRequestDto,
  PassportRequestDto,
  PersonalRequestDto,
  PhoneRequestDto,
  PlateRequestDto,
  VinRequestDto,
} from './enquiry-request.dto'

export const enquiryMethodPayloadDtoMap = {
  personal: PersonalRequestDto,
  phone: PhoneRequestDto,
  email: EmailRequestDto,
  passport: PassportRequestDto,
  itn: ItnRequestDto,
  insurance: InsuranceRequestDto,
  plate: PlateRequestDto,
  vin: VinRequestDto,
  entity: EntityRequestDto,
} as const
