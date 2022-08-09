import { EnquiryContext, EnquiryReference } from './types/parser-payload'
import { isPersonalFields } from '../enquiry/dtos/enquiry-request.dto'
import { toFullname } from '../app/utils/functions/to-fullname'
import { fromRuDateString } from '../app/utils/functions/from-ru-date-string'
import {
  IdentityPropsPayload,
  IdentityPersonalProps,
  IdentityRefProps,
  IdentityUniqueProps,
  PersonalPayload,
} from './types/identification'
import deterministicHash from 'deterministic-object-hash'

export const uniquePropKeys = ['itn']
export const personalPropKeys = [
  'fullname',
  'birth',
  'insurance',
  'passportSerialNum',
  'driversLicenseNum',
  'vehicleInsuranceNum',
]
export const propKeys = [...uniquePropKeys, ...personalPropKeys]

export class ParserIdentityRef implements IdentityRefProps {
  id: string | null = null
  propsHash: string | null
  itn: string | null = null
  personal: IdentityPersonalProps = {
    fullname: null,
    birth: null,
    insurance: [],
    passportSerialNum: [],
    driversLicenseNum: [],
    vehicleInsuranceNum: [],
  }

  determinativePersonalMode: boolean
  determinativePersonal: PersonalPayload
  enquiryId: string

  private deterministicMethods = ['personal', 'passport', 'insurance']
  private referrers: Set<string> = new Set()
  private dirty: boolean
  private full: boolean

  fillProps(payload: IdentityPropsPayload): this {
    const { personal, itn } = payload

    if (itn) this.setUnique({ itn })

    if (personal) {
      const { fullname, birth, ...personalNums } = personal
      const current = this.getNameAndBirth()
      if (!current.fullname && fullname) {
        this.personal.fullname = fullname
      }
      if (!current.birth && birth) {
        this.setBirth(birth)
      }
      if (personalNums) this.setPersonalNums(personalNums)
    }

    return this
  }

  fillPropsByEnquiry(enquiry: EnquiryReference) {
    const props = this.castEnquiryToPropsPayload(enquiry)
    this.fillProps(props)
    if (this.isDeterministicMethod(enquiry.method)) {
      this.determinativePersonalMode = true
      this.determinativePersonal = { ...props.personal }
    }
    return this
  }

  compareProps({ personal, ...unique }: IdentityPropsPayload): boolean {
    if (
      personal &&
      this.isDeterminativePersonalMode() &&
      this.compareWithDeterminantFields(personal)
    ) {
      return true
    }

    if (this.compareUnique(unique)) {
      return true
    }
    return this.comparePersonal(personal)
  }

  addReferer(referer: string): this {
    this.referrers.add(referer)
    return this
  }

  hasReferer(referer: string): boolean {
    return this.referrers.has(referer)
  }

  getFilledPropsFlat(
    props?
  ): IdentityPersonalProps & IdentityUniqueProps & { id?: string } {
    if (!props) props = this.getPropsFlat()
    return Object.keys(props).reduce(
      (acc, crr) => {
        if (!acc[crr] || (Array.isArray(acc[crr]) && !acc[crr].length)) {
          delete acc[crr]
        }
        if (typeof acc[crr] === 'object') {
          this.getFilledPropsFlat(acc[crr])
        }
        return acc
      },
      { ...props }
    )
  }

  getFilledProps(): IdentityRefProps {
    const filledPersonal = this.getFilledPersonal(),
      hasPersonal = !!Object.values(filledPersonal).filter((it) => !!it).length
    return {
      ...(this.id && { id: this.id }),
      ...(this.itn && { itn: this.itn }),
      ...(hasPersonal && {
        personal: filledPersonal,
      }),
    }
  }

  getPersonalHash(payload?: PersonalPayload): string {
    const substrate = payload ?? this.personal
    const personalNum = this.getFirstPersonalNum(substrate)
    return personalNum && this.hasNameAndBirth(substrate)
      ? deterministicHash({
          ...this.getNameAndBirth(),
          ...personalNum,
        })
      : null
  }

  hasUniqueProp(): boolean {
    return !!this.itn
  }

  hasName(substrate): boolean {
    return !!substrate.fullname
  }

  hasBirth(substrate): boolean {
    return !!substrate.birth
  }

  hasNameAndBirth(payload?): boolean {
    const substrate = payload ?? this.personal
    return !!(substrate && this.hasName(substrate) && this.hasBirth(substrate))
  }

  hasNameOrBirth(payload?): boolean {
    const substrate = payload ?? this.personal
    return !!(
      (substrate && this.hasName(substrate)) ||
      this.hasBirth(substrate)
    )
  }

  hasPersonalNum(payload?): boolean {
    const substrate = payload ?? this.personal
    return !!(
      substrate &&
      (substrate.passportSerialNum ||
        substrate.driversLicenseNum ||
        substrate.vehicleInsuranceNum)
    )
  }

  getNameAndBirth(payload?): Pick<IdentityPersonalProps, 'fullname' | 'birth'> {
    const substrate = payload ?? this.personal
    return {
      fullname: substrate?.fullname,
      birth: fromRuDateString(substrate?.birth),
    }
  }

  getFirstPersonalNum(
    payload?
  ): null | Pick<
    IdentityPersonalProps,
    | 'insurance'
    | 'passportSerialNum'
    | 'driversLicenseNum'
    | 'vehicleInsuranceNum'
  > {
    const substrate = payload ?? this.personal
    return substrate.passportSerialNum && substrate.passportSerialNum.length
      ? {
          passportSerialNum: Array.isArray(substrate.passportSerialNum)
            ? substrate.passportSerialNum[0]
            : substrate.passportSerialNum,
        }
      : substrate.driversLicenseNum && substrate.driversLicenseNum.length
      ? {
          driversLicenseNum: Array.isArray(substrate.driversLicenseNum)
            ? substrate.driversLicenseNum[0]
            : substrate.driversLicenseNum,
        }
      : substrate.vehicleInsuranceNum && substrate.vehicleInsuranceNum.length
      ? {
          vehicleInsuranceNum: Array.isArray(substrate.vehicleInsuranceNum)
            ? substrate.vehicleInsuranceNum[0]
            : substrate.vehicleInsuranceNum,
        }
      : null
  }

  getPersonalNums(payload?) {
    const substrate = payload ?? this.personal,
      { passportSerialNum, driversLicenseNum, vehicleInsuranceNum } = substrate
    return {
      passportSerialNum,
      driversLicenseNum,
      vehicleInsuranceNum,
    }
  }

  private getPropsFlat(): IdentityPersonalProps &
    IdentityUniqueProps & { id?: string } {
    return {
      ...this.getUniqueProps(),
      ...this.getPersonalProps(),
    }
  }

  private getProps(): IdentityRefProps {
    return {
      ...this.getUniqueProps(),
      personal: this.getPersonalProps(),
    }
  }

  private getUniqueProps(): IdentityUniqueProps {
    return {
      itn: this?.itn ?? null,
    }
  }

  private getPersonalProps(): IdentityPersonalProps {
    return {
      fullname: this?.personal?.fullname ?? null,
      birth: this?.personal?.birth ?? null,
      passportSerialNum: this?.personal?.passportSerialNum ?? null,
      driversLicenseNum: this?.personal?.driversLicenseNum ?? null,
      vehicleInsuranceNum: this?.personal?.vehicleInsuranceNum ?? null,
    }
  }

  private getFilledPersonal(): IdentityPersonalProps {
    const personal = this.personal
    return {
      ...(personal.birth && { birth: personal.birth }),
      ...(personal.fullname && { fullname: personal.fullname }),
      ...(personal.passportSerialNum &&
        personal.passportSerialNum.length && {
          passportSerialNum: personal.passportSerialNum,
        }),
      ...(personal.driversLicenseNum &&
        personal.driversLicenseNum.length && {
          driversLicenseNum: personal.driversLicenseNum,
        }),
      ...(personal.vehicleInsuranceNum &&
        personal.vehicleInsuranceNum.length && {
          vehicleInsuranceNum: personal.vehicleInsuranceNum,
        }),
    }
  }

  private isDeterministicMethod(method: string): boolean {
    return this.deterministicMethods.includes(method)
  }

  private comparePersonal(payload: PersonalPayload): boolean {
    if (
      this.hasNameOrBirth() &&
      this.hasNameOrBirth(payload) &&
      this.hasPersonalNum() &&
      this.hasPersonalNum(payload)
    ) {
      return this.comparePersonalUnique(payload)
    }
    return false
  }

  private comparePersonalUnique(payload: PersonalPayload): boolean {
    if (!payload) return false
    const laxParam = payload.fullname
        ? payload.fullname
        : payload.birth
        ? payload.birth.getTime()
        : null,
      properLaxParam = this.personal.fullname
        ? this.personal.fullname
        : this.personal.birth
        ? this.personal.birth.getTime()
        : null
    if (!laxParam || !properLaxParam || laxParam !== properLaxParam) {
      return false
    }

    const personalNums = this.getPersonalNums(payload),
      properPersonalNums = this.getPersonalNums()
    for (const personalNumsKey in personalNums) {
      const payloadPersonalNum = personalNums[personalNumsKey],
        properPersonalNum = properPersonalNums[personalNumsKey]
      if (properPersonalNum && properPersonalNum.includes(payloadPersonalNum)) {
        return true
      }
    }
    return false
  }

  private castEnquiryToPropsPayload(
    enquiry: EnquiryContext
  ): IdentityPropsPayload {
    if (this.isDeterministicMethod(enquiry.method)) {
      if (this.isPersonalEnquiry(enquiry)) {
        return {
          personal: this.castEnquiryToPersonalPayload(enquiry),
        }
      }
      if ('query' in enquiry.fields) {
        return { [enquiry.method]: enquiry.fields.query }
      }
    }
    return {}
  }

  private isPersonalEnquiry(enquiry: EnquiryContext): boolean {
    return isPersonalFields(enquiry.fields) || enquiry.method === 'passport'
  }

  private castEnquiryToPersonalPayload(
    enquiry: EnquiryContext
  ): PersonalPayload {
    if (isPersonalFields(enquiry.fields)) {
      return {
        fullname: toFullname(enquiry.fields),
        birth: fromRuDateString(enquiry.fields.birth),
      }
    } else if (enquiry.method === 'insurance') {
      return {
        insurance: enquiry.fields.query,
      }
    } else if (enquiry.method === 'passport') {
      return {
        passportSerialNum: enquiry.fields.query,
      }
    }
  }

  private isDeterminativePersonalMode(): boolean {
    return (
      (!!this.determinativePersonal?.fullname &&
        !!this.determinativePersonal?.birth) ||
      !!this.determinativePersonal?.passportSerialNum
    )
  }

  private compareWithDeterminantFields(payload: PersonalPayload): boolean {
    const { fullname, birth, ...personal } = payload
    const {
      fullname: enquiryFullname,
      birth: enquiryBirth,
      passportSerialNum: enquiryPassport,
      insurance: enquiryInsurance,
    } = this.determinativePersonal
    if ((enquiryFullname && fullname) || (enquiryBirth && birth)) {
      return enquiryFullname && fullname
        ? enquiryFullname === fullname
        : enquiryBirth.getTime() === birth.getTime()
    }
    if (
      personal?.passportSerialNum &&
      enquiryPassport &&
      typeof enquiryPassport === 'string'
    ) {
      return personal.passportSerialNum.includes(enquiryPassport)
    }
    if (
      personal?.insurance &&
      enquiryInsurance &&
      typeof enquiryInsurance === 'string'
    ) {
      return personal.insurance.includes(enquiryInsurance)
    }
    return false
  }

  private compareUnique({ itn }: IdentityUniqueProps): boolean {
    if (itn && this.itn) {
      return itn === this.itn
    }
    return false
  }

  private setBirth(birth: Date | string): this {
    if (typeof birth === 'string') birth = fromRuDateString(birth)
    this.personal.birth = birth
    return this
  }

  private setPersonalNums({
    insurance,
    passportSerialNum,
    driversLicenseNum,
    vehicleInsuranceNum,
  }: PersonalPayload): void {
    if (insurance && !this.personal.insurance.includes(insurance)) {
      this.personal.insurance.push(insurance)
    }
    if (
      passportSerialNum &&
      !this.personal.passportSerialNum.includes(passportSerialNum)
    ) {
      this.personal.passportSerialNum.push(passportSerialNum)
    }
    if (
      driversLicenseNum &&
      !this.personal.driversLicenseNum.includes(driversLicenseNum)
    ) {
      this.personal.driversLicenseNum.push(driversLicenseNum)
    }
    if (
      vehicleInsuranceNum &&
      !this.personal.vehicleInsuranceNum.includes(vehicleInsuranceNum)
    ) {
      this.personal.vehicleInsuranceNum.push(vehicleInsuranceNum)
    }
  }

  private setUnique({ itn }: Pick<IdentityPropsPayload, 'itn'>): void {
    if (itn && !this.itn) {
      this.itn = itn
    }
  }

  calcPropsHash(): string {
    this.propsHash = deterministicHash(this.getFilledProps())
    return this.propsHash
  }

  getPropsHash(): string {
    return this.propsHash ?? this.calcPropsHash()
  }
}
