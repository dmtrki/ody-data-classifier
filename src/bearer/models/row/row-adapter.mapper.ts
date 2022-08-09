import { Injectable } from '@nestjs/common'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  typeConverter,
} from '@automapper/core'
import { PipelineRowDto } from '../../../parser/dtos/pipeline-row.dto'
import { AdaptedPipelineRowDto, RowMetaDto } from './row-reference.dto'
import deterministicHash from 'deterministic-object-hash'

@Injectable()
export class RowAdapterMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        PipelineRowDto,
        AdaptedPipelineRowDto,
        typeConverter(String, Date, (dateString) => new Date(dateString)),
        forMember(
          (destination) => destination.hash,
          mapFrom(({ label, value, type, parent: { identityId } }) =>
            deterministicHash({ value, type, label, identityId })
          )
        ),
        forMember(
          (destination) => destination.value,
          mapFrom((source) => source.value)
        ),
        forMember(
          (destination) => destination.typeKey,
          mapFrom((source) => source.type)
        ),
        forMember(
          (destination) => destination.enquiryId,
          mapFrom((source) => source.parent.enquiryRef.id)
        ),
        forMember(
          (destination) => destination.identityId,
          mapFrom((source) => source.parent.identityId)
        ),
        forMember(
          (destination) => destination.unionHash,
          mapFrom((source) => source.unionHash ?? null)
        ),
        forMember(
          (destination) => destination.meta,
          mapFrom(
            ({
              label,
              parent: { data, enquiryRef, union, ...parentMeta },
            }): RowMetaDto => ({
              label: label,
              parent: parentMeta,
            })
          )
        )
      )
    }
  }
}
