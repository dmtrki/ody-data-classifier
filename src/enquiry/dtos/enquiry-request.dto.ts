import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger'
import {
  IsAlphanumeric,
  IsEmail,
  IsMobilePhone,
  IsNumberString,
  IsOptional,
  IsPassportNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator'

export class EnquiryRequestOptions {
  @ApiPropertyOptional({
    type: 'boolean',
    default: false,
    description:
      'При установке этого флага, кеш результатов будет игнорироваться',
  })
  refresh?: boolean
}

export class EnquiryRequestDto {
  @ApiPropertyOptional({ type: EnquiryRequestOptions })
  public options?: EnquiryRequestOptions
}

export class PersonalFieldGroupDto {
  @ApiProperty({
    description: 'Фамилия',
    example: 'Иванов',
  })
  @IsString()
  lastname: string

  @ApiProperty({
    description: 'Имя',
    example: 'Дмитрий',
  })
  @IsString()
  firstname: string

  @ApiPropertyOptional({
    description: 'Отчество',
    example: 'Иванович',
  })
  @IsString()
  @IsOptional()
  patronymic?: string

  @ApiProperty({
    description: 'Дата рождения в формате dd.mm.yyyy',
    type: 'string',
    format: 'date',
    example: '01.01.2000',
  })
  @Matches(/^(0|0[1-9]|[12]\d|3[01])\.(0|0[1-9]|1[0-2])\.((?:19|20)\d{2})$/im, {
    message: 'Недопустимый формат $property',
  })
  birth: string
}
export class PersonalRequestDto extends IntersectionType(
  EnquiryRequestDto,
  PersonalFieldGroupDto
) {}

export class PhoneFieldGroupDto {
  @ApiProperty({
    example: '79991234567',
  })
  @IsMobilePhone('ru-RU')
  query: string
}
export class PhoneRequestDto extends IntersectionType(
  EnquiryRequestDto,
  PhoneFieldGroupDto
) {}

export class EmailFieldGroupDto {
  @ApiProperty({
    example: 'email@domain.com',
  })
  @IsEmail()
  query: string
}
export class EmailRequestDto extends IntersectionType(
  EnquiryRequestDto,
  EmailFieldGroupDto
) {}

export class PassportFieldGroupDto {
  @ApiProperty({
    description: 'Серия и номер паспорта слитно',
    example: '1111222222',
  })
  @IsNumberString()
  @Length(10, 10)
  query: string
}
export class PassportRequestDto extends IntersectionType(
  EnquiryRequestDto,
  PassportFieldGroupDto
) {}

export class ItnFieldGroupDto {
  @ApiProperty({
    description: 'ИНН физ. лица',
  })
  @IsNumberString()
  @Length(12, 12)
  query: string
}
export class ItnRequestDto extends IntersectionType(
  EnquiryRequestDto,
  ItnFieldGroupDto
) {}

export class InsuranceFieldGroupDto {
  @ApiProperty({
    description: 'Номер СНИЛС (только цифры)',
    example: '11111111111',
  })
  @IsNumberString()
  @Length(11, 11)
  query: string
}
export class InsuranceRequestDto extends IntersectionType(
  EnquiryRequestDto,
  InsuranceFieldGroupDto
) {}

export class PlateFieldGroupDto {
  @ApiProperty({
    description: 'Госномер автомобиля кириллицей',
    example: 'В777ЕС770',
  })
  @Matches(/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/iu, {
    message: 'Неправильный формат госномера',
  })
  query: string
}
export class PlateRequestDto extends IntersectionType(
  EnquiryRequestDto,
  PlateFieldGroupDto
) {}

export class VinFieldGroupDto {
  @ApiProperty({
    description: 'Vehicle identification number',
    example: '4USBT53544LT26841',
  })
  @Matches(/^[0123456789ABCDEFGHJKLMNPRSTUVWXYZ]{17}$/i, {
    message: 'Неправильный формат VIN',
  })
  query: string
}
export class VinRequestDto extends IntersectionType(
  EnquiryRequestDto,
  VinFieldGroupDto
) {}

export class EntityFieldGroupDto {
  @ApiProperty({
    description: 'ИНН или ОГРН юрлица',
  })
  @IsAlphanumeric()
  query: string
}
export class EntityRequestDto extends IntersectionType(
  EnquiryRequestDto,
  EntityFieldGroupDto
) {}

export type IncomingEnquiryRequest =
  | PersonalRequestDto
  | PhoneRequestDto
  | EmailRequestDto
  | PassportRequestDto
  | ItnRequestDto
  | InsuranceRequestDto
  | PlateRequestDto
  | VinRequestDto
  | EntityRequestDto

export function isPersonalFields(
  input: unknown
): input is PersonalFieldGroupDto {
  return (
    typeof input === 'object' &&
    input != null &&
    'firstname' in input &&
    'patronymic' in input &&
    'lastname' in input &&
    'birth' in input
  )
}
