import {
  IsDate,
  IsDefined,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator'
import { EnquiryMetaDto } from './enquiry-meta.dto'
import { EnquirySourceDto } from './enquiry-source.dto'
import { EnquiryAttemptDto } from './enquiry-attempt.dto'
import { EnquiryStatus } from '../../report/types/enquiry.status'
import { ApiProperty } from '@nestjs/swagger'
import { IdentityReferenceDto } from '../../bearer/models/identity/identity-reference.dto'
import { RowReferenceDto } from '../../bearer/models/row/row-reference.dto'

export class EnquiryReferenceDto {
  @IsDefined()
  @IsString()
  id?: string
  @ApiProperty({
    enum: EnquiryStatus,
    description: `
    ACCEPTED — зарегистрирована в системе
    WAITING — запрос отправлен в одиссей, ожидается ответ
    PROCESSING — получен результат одиссея, идет парсинг
    COMPLETE — обработка успешно завершена
    ERROR — ошибка на любом из этапов
    `,
  })
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus
  @IsOptional()
  meta?: EnquiryMetaDto
  @IsOptional()
  @IsDate()
  createdAt?: Date
  @IsOptional()
  @IsDate()
  updatedAt?: Date
  @IsOptional()
  attempts?: EnquiryAttemptDto[]
  @IsOptional()
  lastAttempt?: EnquiryAttemptDto
  @IsOptional()
  rows?: RowReferenceDto[]
  @IsOptional()
  identities?: IdentityReferenceDto[]
}
