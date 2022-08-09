import { IsOptional, IsString, Matches } from 'class-validator'

export class NameFullFieldsDto {
  @IsString()
  firstname: string

  @IsString()
  lastname: string

  @IsString()
  middlename: string

  @Matches(/^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.((?:19|20)\d{2})$/im, {
    message: 'Недопустимый формат $property',
  })
  birthday: string
}

export class NameStandartFieldsDto {
  @IsString()
  firstname: string

  @IsString()
  lastname: string

  @IsOptional()
  @IsString()
  middlename?: string

  @Matches(/^(0|0[1-9]|[12]\d|3[01])\.(0|0[1-9]|1[0-2])\.((?:19|20)\d{2})$/im, {
    message: 'Недопустимый формат $property',
  })
  birthday: string
}

export class PhoneFieldsDto {
  phone: string
}

export class EmailFieldsDto {
  email: string
}

export class PassportFieldsDto {
  serialNumber: string
}

export class InnFlFieldsDto {
  inn_fl: string
}

export class SnilsFieldsDto {
  snils: string
}

export class AvtoFieldsDto {
  avto: string
}

export class VinFieldsDto {
  vin: string
}

export class InnFieldsDto {
  inn: string
  ogrn: string
}

export type ExternalFieldGroup =
  | NameFullFieldsDto
  | NameStandartFieldsDto
  | PhoneFieldsDto
  | EmailFieldsDto
  | PassportFieldsDto
  | InnFlFieldsDto
  | SnilsFieldsDto
  | AvtoFieldsDto
  | VinFieldsDto
  | InnFieldsDto
