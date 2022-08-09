import { Prisma } from '@prisma/client'
import { IsInt, IsDefined, IsString, IsOptional, IsEnum } from 'class-validator'
import { RowTypeModel } from './row-type.model'
import { RowUnionTypeModel } from './row-union-type.model'
import { PrismaService } from '../../app/prisma/prisma.service'
import { BaseModel } from './base.model'
import { DataGroupKeysEnum } from '../../parser/maps/data-groups.enum'

export class DataGroupReference {
  @IsInt()
  id?: number
  @IsEnum(DataGroupKeysEnum)
  key!: keyof typeof DataGroupKeysEnum
  meta?: Prisma.JsonValue
  types?: () => RowTypeModel[]
  unions?: () => RowUnionTypeModel[]
}

export class DataGroupModel extends BaseModel {
  protected ref: DataGroupReference
  protected prismaMemberKey = 'dataGroup'
  protected idKey = 'id'
  protected findIncludes = {
    types: true,
    unions: true,
  }
}
