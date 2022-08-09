import { PrismaService } from '../../app/prisma/prisma.service'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { addProfile, Mapper } from '@automapper/core'
import { RowReferenceDto } from './row/row-reference.dto'
import { RowUnionTypeReferenceDto } from './row-union-type.model'
import { RowUnionReferenceDto } from './row-union/row-union-reference.dto'
import { Injectable, Logger, Type } from '@nestjs/common'
import { ModelFactory } from '../model.factory'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaClient } from '@prisma/client'
import { EnquiryReferenceDto } from '../../enquiry/dtos/enquiry-reference.dto'

export type ModelReference =
  | RowReferenceDto
  | RowUnionTypeReferenceDto
  | RowUnionReferenceDto
  | EnquiryReferenceDto

@Injectable()
export abstract class BaseModel {
  protected idKey: string
  protected propsKeys: string[]
  protected ref: ModelReference
  protected mapperProfile: AutomapperProfile
  protected prismaMemberKey: string
  protected db
  protected defaultInputs: Record<string, object>

  constructor(
    protected prisma: PrismaService,
    protected emitter: EventEmitter2,
    @InjectMapper() protected mapper: Mapper
  ) {
    this.setDatabaseClient(prisma)
    if (this.mapperProfile) {
      addProfile(this.mapper, this.mapperProfile.profile)
    }
  }

  setDatabaseClient(client?) {
    if (!client) client = this.prisma
    this.db =
      this.prismaMemberKey && client[this.prismaMemberKey]
        ? client[this.prismaMemberKey]
        : client
    return this
  }

  handlePipelineDto(dto: unknown) {
    return dto
  }

  async find(id: string | number) {
    return await this.db.findUnique({
      where: {
        [this.idKey]: id,
      },
    })
  }

  async save() {
    if (!this[this.idKey]) throw Error
    const saveData = this.propsKeys.map((propKey) => {
      return {
        [propKey]: this[propKey],
      }
    })
    this.db.update({
      where: {
        [this.idKey]: this[this.idKey],
      },
      data: {
        ...saveData,
      },
    })
  }
}
