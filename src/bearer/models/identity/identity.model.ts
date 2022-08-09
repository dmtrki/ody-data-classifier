import { BaseModel } from '../base.model'
import { Prisma, PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import {
  IdentityPersonalProps,
  IdentityRefProps,
} from '../../../parser/types/identification'
import { ParserIdentityRef } from '../../../parser/parser-identity-ref'
import { InternalError } from '../../../app/filters/internal-error.exception'

@Injectable()
export class IdentityModel extends BaseModel {
  protected prismaMemberKey = 'identity'
  protected db: PrismaClient['identity']

  async instantiateRef(ref: ParserIdentityRef): Promise<{ id: string } | null> {
    try {
      const props = ref.getFilledProps()

      const exists = await this.db.findFirst({
        where: this.castPropsToWhereInput(props),
        select: { id: true, itn: true },
      })

      if (exists) {
        const { id, itn } = exists
        return await this.db.update({
          where: {
            id,
          },
          data: {
            ...this.makeCreateOrUpdateInput({ ...props, itn }),
          },
        })
      } else {
        return await this.db.create({
          data: {
            ...this.makeCreateOrUpdateInput(props),
          },
          select: { id: true },
        })
      }
    } catch (e) {
      throw new InternalError(e, 'failed identity ref instantiation')
    }
  }

  private castPropsToWhereInput(
    props: IdentityRefProps
  ): Prisma.IdentityWhereInput {
    return {
      OR: [
        ...this.makeUniqueWhereInput(props),
        ...this.makePersonalWhereInput(props.personal),
      ],
    }
  }

  private makeUniqueWhereInput({ itn }: IdentityRefProps) {
    return [...(itn ? [{ itn }] : [])]
  }

  private makeCreateOrUpdateInput({ itn, personal }: IdentityRefProps) {
    return {
      ...(itn && { itn }),
      ...this.makePersonalCreateOrUpdateInput(personal),
    }
  }

  private makePersonalWhereInput(personal: IdentityPersonalProps) {
    if (!personal) return []
    const personalEntries = Object.entries(personal).filter(([, v]) => !!v)
    return personalEntries.flatMap(([aKey, aValue], index) => {
      return personalEntries.slice(index + 1).flatMap(([bKey, bValue]) => {
        const excludedCombination = ['fullname', 'birth']
        if (
          excludedCombination.includes(aKey) &&
          excludedCombination.includes(bKey)
        ) {
          return []
        }
        return {
          AND: [
            {
              personal: {
                path: [aKey],
                ...this.makeJsonCondition(aValue),
              },
            },
            {
              personal: {
                path: [bKey],
                ...this.makeJsonCondition(bValue),
              },
            },
          ],
        }
      })
    })
  }

  private makeJsonCondition(value) {
    if (Array.isArray(value) && value.length) {
      return {
        array_contains: value,
      }
    } else {
      return {
        equals: value instanceof Date ? value.toJSON() : value,
      }
    }
  }

  private makePersonalCreateOrUpdateInput(personal: IdentityPersonalProps) {
    return personal
      ? {
          personal: personal as Prisma.InputJsonObject,
        }
      : {}
  }
}
