import { EnquiryMetaDto } from '../../enquiry/dtos/enquiry-meta.dto'
import { PersonalRequestDto } from '../../enquiry/dtos/enquiry-request.dto'
import { EnquiryStatus } from '@prisma/client'

export type CheckedEnquiry = {
  id: string
  meta: EnquiryMetaDto
}

export type EnquiryContext = Pick<EnquiryMetaDto, 'method' | 'fields'>

export type PersonalEnquiryContext = EnquiryContext & {
  fields: PersonalRequestDto & {
    birth: Date
  }
}

export type EnquiryReference = EnquiryContext & {
  id: string
}
