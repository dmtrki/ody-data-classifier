import { IsDate, IsDefined, IsIn, IsOptional, IsString } from 'class-validator'
import { Prisma } from '@prisma/client'
import { getEnumValues } from '../../app/utils/functions/get-enum-values'
import { EnquiryReferenceDto } from './enquiry-reference.dto'

export enum EnquiryAttemptProducedType {
  CREATE = 'CREATE',
  REFRESH = 'REFRESH',
  GIVE = 'GIVE',
  VOID = 'VOID',
}

export class EnquiryAttemptDto {
  @IsString()
  id?: string

  @IsDefined()
  @IsIn(getEnumValues(EnquiryAttemptProducedType))
  produced!: EnquiryAttemptProducedType

  @IsOptional()
  meta?: Prisma.JsonObject

  @IsDefined()
  @IsDate()
  createdAt!: Date

  @IsOptional()
  enquiry?: EnquiryReferenceDto

  @IsOptional()
  @IsString()
  enquiryId?: string
}
