import {
  ParserIdentityRef,
  personalPropKeys,
  propKeys,
} from '../parser-identity-ref'
import { PipelineBlockDto } from '../dtos/pipeline-block.dto'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import {
  IdentityPropsPayload,
  BlockIdentifyingPayload,
} from '../types/identification'
import { fromRuDateString } from '../../app/utils/functions/from-ru-date-string'
import { IdentityModel } from '../../bearer/models/identity/identity.model'

export class IdentitiesReflector {
  private readonly propKeys = propKeys
  private readonly personalPropKeys = personalPropKeys
  private readonly references: ParserIdentityRef[] = []

  constructor(refs?: ParserIdentityRef[]) {
    if (refs) this.references = refs
  }

  handleBlock(block: PipelineBlockDto): this {
    const props = this.castToProps(block.data)
    this.fillOrFresh({ props, enquiry: block.enquiryRef }, block.hash)
    return this
  }

  async prepare(model: IdentityModel): Promise<IdentitiesReflector> {
    const refs = this.collapseRefs()
    for await (const ref of refs) {
      const instance = await model.instantiateRef(ref)
      ref.id = instance.id ?? null
    }
    return new IdentitiesReflector(refs)
  }

  getRefs(): ParserIdentityRef[] {
    return this.references
  }

  findByReferer(blockHash: string): ParserIdentityRef | null {
    for (const reference of this.references) {
      if (reference.hasReferer(blockHash)) {
        return reference
      }
    }
    return null
  }

  castToProps(rows: PipelineRowDto[]): IdentityPropsPayload {
    return rows
      .filter((row) => this.isProperType(row.type))
      .reduce(
        (
          props: IdentityPropsPayload,
          row: PipelineRowDto
        ): IdentityPropsPayload => {
          if (this.isPersonalPropType(row.type)) {
            return {
              ...props,
              personal: {
                ...props?.personal,
                [row.type]:
                  row.type === 'birth'
                    ? fromRuDateString(row.value)
                    : row.value,
              },
            }
          }
          return { ...props, ...{ [row.type]: row.value } }
        },
        {}
      )
  }

  private isProperType(type: string): boolean {
    return this.propKeys.includes(type)
  }

  private isPersonalPropType(key: string): boolean {
    return this.personalPropKeys.includes(key)
  }

  private createRef(
    { props, enquiry }: BlockIdentifyingPayload,
    refererHash: string
  ): void {
    const freshRef = new ParserIdentityRef()
    if (enquiry) {
      freshRef.fillPropsByEnquiry(enquiry)
    }
    freshRef.fillProps(props).addReferer(refererHash)
    this.references.push(freshRef)
  }

  private fillOrFresh(
    { props, enquiry }: BlockIdentifyingPayload,
    refererHash: string
  ): void {
    for (const ref of this.references) {
      if (ref.compareProps(props)) {
        ref.fillProps(props).addReferer(refererHash)
        return
      }
    }
    this.createRef({ props, enquiry }, refererHash)
  }

  private collapseRefs(): ParserIdentityRef[] {
    return this.getRefsWithUniqueProps()
  }

  private getRefsWithUniqueProps(): ParserIdentityRef[] {
    const collector = []
    this.references.forEach((ref) => {
      if (ref.hasUniqueProp()) {
        collector.push(ref)
      }
    })
    return collector
  }
}
