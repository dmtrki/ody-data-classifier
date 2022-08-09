import { EnquiryReference } from './parser-payload'

export type IdentityUniqueProps = {
  itn?: string
}

export type IdentityPersonalProps = {
  fullname?: string | null
  birth?: Date | null
  insurance?: string[] | null
  passportSerialNum?: string[] | null
  driversLicenseNum?: string[] | null
  vehicleInsuranceNum?: string[] | null
}

export type PersonalPayload = {
  fullname?: string | null
  birth?: Date | null
  insurance?: string
  passportSerialNum?: string
  driversLicenseNum?: string
  vehicleInsuranceNum?: string
}

export interface IdentityRefProps extends IdentityUniqueProps {
  id?: string
  personal?: IdentityPersonalProps
}

export interface IdentityPropsPayload extends IdentityUniqueProps {
  personal?: PersonalPayload
}

export type BlockIdentifyingPayload = {
  props: IdentityPropsPayload
  enquiry?: EnquiryReference
}

export class IdentityPropsDto implements IdentityRefProps {
  id?
  itn?
  insurance?
  personal?
}
