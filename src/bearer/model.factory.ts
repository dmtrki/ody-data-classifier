import { ModelKey } from './types/model'
import { Injectable, MethodNotAllowedException, Type } from '@nestjs/common'
import { InjectMapper } from '@automapper/nestjs'
import { Mapper } from '@automapper/core'
import { PrismaService } from '../app/prisma/prisma.service'
import { ModuleRef } from '@nestjs/core'
import { DataGroupModel } from './models/data-group.model'
import { RowModel } from './models/row/row.model'
import { RowTypeModel } from './models/row-type.model'
import { RowUnionModel } from './models/row-union/row-union.model'
import { RowUnionTypeModel } from './models/row-union-type.model'
import { TypeDetectionCaseModel } from './models/type-detection-case.model'
import { EnquiryModel } from './models/enquiry.model'
import { PrismaClient } from '@prisma/client'
import { BaseModel } from './models/base.model'
import { IdentityModel } from './models/identity/identity.model'

const modelsMap = {
  dataGroup: DataGroupModel,
  row: RowModel,
  rowType: RowTypeModel,
  rowUnion: RowUnionModel,
  rowUnionType: RowUnionTypeModel,
  typeDetectionCase: TypeDetectionCaseModel,
  enquiry: EnquiryModel,
  identity: IdentityModel,
} as const

export type ModelsKey = keyof typeof modelsMap
export type ModelValue = typeof modelsMap[ModelsKey]

type MMM = {
  readonly [P in ModelsKey]: ModelValue
}

@Injectable()
export class ModelFactory {
  private readonly modelsMap: MMM = {
    ...modelsMap,
  } as const

  constructor(
    private moduleRef: ModuleRef,
    @InjectMapper() protected mapper: Mapper,
    protected prisma: PrismaService
  ) {}

  public async make<K extends keyof typeof modelsMap>(
    modelKey: K,
    client?: Partial<PrismaClient> | null
  ): Promise<InstanceType<typeof modelsMap[K]>> {
    try {
      const model = await this.moduleRef.create(this.modelsMap[modelKey] as any)
      return model.setDatabaseClient(client ?? this.prisma)
    } catch (error) {
      throw new MethodNotAllowedException(error)
    }
  }

  public get(token) {
    return this.moduleRef.get(token)
  }
}
