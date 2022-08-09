import { Prisma } from '@prisma/client'
import { IsInt, IsDefined, IsString, IsOptional } from 'class-validator'
import { DataGroupModel } from './data-group.model'
import { RowUnionTypeModel } from './row-union-type.model'
import { RowModel } from './row/row.model'
import { TypeDetectionCaseModel } from './type-detection-case.model'
import { BaseModel } from './base.model'

export class RowTypeModel extends BaseModel {
  @IsDefined()
  @IsInt()
  id!: number

  @IsDefined()
  @IsString()
  key!: string

  @IsDefined()
  rows!: RowModel[]

  @IsDefined()
  cases!: TypeDetectionCaseModel[]

  @IsOptional()
  union?: RowUnionTypeModel

  @IsOptional()
  @IsInt()
  unionId?: number

  @IsDefined()
  group!: DataGroupModel

  @IsDefined()
  @IsInt()
  groupId!: number
}
