import { tagTriggersMap } from '../../maps/tag-triggers.map'
import { Observable } from 'rxjs'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'
import { PipelineBlockDto } from '../../dtos/pipeline-block.dto'
import { Arrable } from '../../../app/utils/types/arrable'

export type TriggerEffector<I = PipelineRowDto, O = Arrable<I>> = (
  triggeredBy: I
) => Promise<O> | O
export type TriggerMulticastEffect<I = PipelineRowDto, O = I> = (
  from: I
) => Promise<O> | Arrable<O>
export type TriggerDestructEffect<I = PipelineRowDto> = (
  from: I
) => Arrable<I> | Promise<I>
export type TriggerFiltrateEffect<I = PipelineRowDto> = (target: I) => boolean

export type RowTypeEffects =
  | TriggerEffector
  | {
      destruct?: TriggerDestructEffect
      multicast?: TriggerMulticastEffect
    }

export type TagEffect = TriggerMulticastEffect<Partial<PipelineBlockDto>>
