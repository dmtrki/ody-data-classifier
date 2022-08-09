import {
  IsInt,
  IsDefined,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator'
import { DataGroupModel } from './data-group.model'
import { RowTypeModel } from './row-type.model'
import { BaseModel } from './base.model'

export class RowUnionTypeReferenceDto {
  @IsInt()
  id?: number

  @IsString()
  key?: string

  types?: () => RowTypeModel[]

  group?: () => DataGroupModel

  @IsInt()
  groupId?: number
}

export class RowUnionTypeModel extends BaseModel {
  protected ref: RowUnionTypeReferenceDto
}
