import { RowReferenceDto } from '../row/row-reference.dto'
import { Enquiry } from '@prisma/client'
import { AutoMap } from '@automapper/classes'

export class IdentityReferenceDto {
  @AutoMap()
  itn: string | null

  @AutoMap()
  insurance: string | null

  id?: string
  hash: string | null
  createdAt: Date
  updatedAt: Date

  rows?: RowReferenceDto[]
  enquiries?: Enquiry[]
}
