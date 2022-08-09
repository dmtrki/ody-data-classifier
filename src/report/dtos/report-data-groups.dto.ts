import { TreeGroupBranch } from '../../bearer/types/tree-group-branch'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { RowMetaDto } from '../../bearer/models/row/row-reference.dto'
import { DataTree } from '../types/data-tree'
import { IdentityReferenceDto } from '../../bearer/models/identity/identity-reference.dto'
import { EnquiryReferenceDto } from '../../enquiry/dtos/enquiry-reference.dto'
import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator'
import { EnquiryMetaDto } from '../../enquiry/dtos/enquiry-meta.dto'
import { EnquiryAttemptDto } from '../../enquiry/dtos/enquiry-attempt.dto'

export class ReportDataRowDto {
  @ApiProperty()
  value: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  identityId: string

  @ApiProperty()
  meta: RowMetaDto
}

export class ReportCommonDataGroupDto {
  fullname?: ReportDataRowDto[]
  birth?: ReportDataRowDto[]
  death?: ReportDataRowDto[]
  militariable?: ReportDataRowDto
}

export class ReportPersonalDataGroupDto {
  itn?: ReportDataRowDto[]
  insurance?: ReportDataRowDto[]
  birthLocation?: ReportDataRowDto[]
  citizenship?: ReportDataRowDto[]
  nationality?: ReportDataRowDto[]
  passportSerialNum?: ReportDataRowDto[]
  passportReleaseDate?: ReportDataRowDto[]
  passportReleaseUnit?: ReportDataRowDto[]
  passportReleaseUnitId?: ReportDataRowDto[]
}

export class ReportContactsDataGroupDto {
  phoneNum?: ReportDataRowDto[]
  phoneDevice?: ReportDataRowDto[]
  homePhone?: ReportDataRowDto[]
  relatedPhone?: ReportDataRowDto[]
  email?: ReportDataRowDto[]
  website?: ReportDataRowDto[]
  viber?: ReportDataRowDto[]
  whatsapp?: ReportDataRowDto[]
  telegram?: ReportDataRowDto[]
  skype?: ReportDataRowDto[]
  vkID?: ReportDataRowDto[]
  vkPrivacyStatus?: ReportDataRowDto[]
  instagram?: ReportDataRowDto[]
  facebook?: ReportDataRowDto[]
  twitter?: ReportDataRowDto[]
  possiblePassword?: ReportDataRowDto[]
  nickname?: ReportDataRowDto[]
  trueCaller?: ReportDataRowDto[]
  tags?: ReportDataRowDto[]
}

export class ReportEmployerUnionDto {
  jobEmployerTitle?: ReportDataRowDto
  jobEmployerItn?: ReportDataRowDto
  jobEmployerAddress?: ReportDataRowDto
  jobEmployerPhone?: ReportDataRowDto
  jobEmployerManagersPhone?: ReportDataRowDto
  jobEmployerAccountantsPhone?: ReportDataRowDto
  jobTitle?: ReportDataRowDto
  jobIncomeSum?: ReportDataRowDto
  jobIncomeDate?: ReportDataRowDto
  jobRelatedPersons?: ReportDataRowDto
}

export class ReportJobsDataGroupDto {
  employers?: ReportEmployerUnionDto[]
}

export class VehiclesUnionDto {
  vehicleNum?: ReportDataRowDto
  vehicleVin?: ReportDataRowDto
  vehicleRelatedPersons?: ReportDataRowDto
  vehicleBrand?: ReportDataRowDto
  vehicleModel?: ReportDataRowDto
  vehicleReleaseYear?: ReportDataRowDto
  vehicleRegistrationDate?: ReportDataRowDto
  vehicleDeregistrationDate?: ReportDataRowDto
  vehicleRegistrationCertificateNum?: ReportDataRowDto
  vehiclePassport?: ReportDataRowDto
  vehicleInsuranceAgent?: ReportDataRowDto
  vehicleInsuranceNum?: ReportDataRowDto
  vehicleRestriction?: ReportDataRowDto
  vehicleOwnerFullname?: ReportDataRowDto
}

export class ReportVehiclesDataGroupDto {
  driversLicenseNum: ReportDataRowDto[]
  driversLicenseReleaseDate: ReportDataRowDto[]
  driversLicenseCategory: ReportDataRowDto[]
  vehicles: VehiclesUnionDto
}

export class ReportEducationUnionDto {
  educationInstitution?: ReportDataRowDto
  educationFaculty?: ReportDataRowDto
  educationSpeciality?: ReportDataRowDto
  educationForm?: ReportDataRowDto
  educationDiplomaReleaseDate?: ReportDataRowDto
}

export class ReportEducationDataGroupDto {
  instances: ReportEducationUnionDto
}

export class ReportAddressesDataGroupDto {
  addressResidence?: ReportDataRowDto[]
  addressRegistration?: ReportDataRowDto[]
  addressOther?: ReportDataRowDto[]
}

export class ReportDataGroupsDto {
  @ApiPropertyOptional()
  common?: ReportCommonDataGroupDto

  @ApiPropertyOptional()
  personal?: ReportPersonalDataGroupDto

  @ApiPropertyOptional()
  contacts?: ReportContactsDataGroupDto

  @ApiPropertyOptional()
  jobs?: ReportJobsDataGroupDto

  @ApiPropertyOptional()
  vehicles?: ReportVehiclesDataGroupDto

  @ApiPropertyOptional()
  education?: ReportEducationDataGroupDto

  @ApiPropertyOptional()
  addresses?: ReportAddressesDataGroupDto

  @ApiPropertyOptional()
  unknown?: ReportDataRowDto[]
}

export class ReportDataContext extends EnquiryReferenceDto {
  @IsDefined()
  @IsString()
  id: string

  @ApiProperty({
    type: EnquiryMetaDto,
  })
  meta?: EnquiryMetaDto

  @IsOptional()
  @IsDate()
  createdAt: Date

  @IsDate()
  updatedAt: Date

  @IsOptional()
  attempts?: EnquiryAttemptDto[]

  @IsOptional()
  identities?: IdentityReferenceDto[]
}

export class ReportDataDto {
  @ApiProperty({
    readOnly: true,
    description: 'Ссылка на отчет Одиссея',
  })
  readonly odysseyLink: string

  @ApiProperty({
    readOnly: true,
    description: 'request_id выданный Одиссеем',
  })
  readonly odysseyToken: number | string

  @ApiProperty({
    readOnly: true,
    description: 'Обработанные данные отчета',
  })
  readonly dataset: DataTree

  @ApiProperty()
  readonly context: ReportDataContext
}
