import { Injectable } from '@nestjs/common'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core'
import { ReportTreeLeafDto } from './dtos/report-tree-leaf-dto'
import { TreeSourceDto } from './dtos/tree-source.dto'
import { RowMetaDto } from '../bearer/models/row/row-reference.dto'

@Injectable()
export class TreeLeafMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        TreeSourceDto,
        ReportTreeLeafDto,
        forMember(
          (destination) => destination.type,
          mapFrom((source) => source.type.key)
        ),
        forMember(
          (destination) => destination.group,
          mapFrom((source) => source.type.group.key)
        ),
        forMember(
          (destination) => destination.union,
          mapFrom((source) => source?.union?.type?.key ?? null)
        ),
        forMember(
          (destination) => destination.from,
          mapFrom((source) => source?.union?.hash ?? source.meta['parent'].hash)
        ),
        forMember(
          (destination) => destination.value,
          mapFrom((source) => source.value)
        ),
        forMember(
          (destination) => destination.identityId,
          mapFrom((source) => source.identityId)
        ),
        forMember(
          (destination) => destination.meta,
          mapFrom((source) => source.meta as unknown as RowMetaDto)
        ),
        forMember(
          (destination) => destination.hash,
          mapFrom((source) => source.hash)
        ),
        forMember(
          (destination) => destination.createdAt,
          mapFrom((source) => source.createdAt)
        )
      )
    }
  }
}
