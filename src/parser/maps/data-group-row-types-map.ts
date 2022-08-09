import { DataGroupKey } from '../../bearer/types/tree-group-branch'
import { vehiclesTypesTriggers } from './row-type-triggers/vehicles'
import { addressesTypesTriggers } from './row-type-triggers/addresses'
import { jobsTypesTriggers } from './row-type-triggers/jobs'
import { contactsTypesTriggers } from './row-type-triggers/contacts'
import { personalTypesTriggers } from './row-type-triggers/personal'
import { commonTypesTriggers } from './row-type-triggers/common'
import { educationTypesTriggers } from './row-type-triggers/education'
import { movementsTypesTriggers } from './row-type-triggers/movements'
import { negativeTypesTriggers } from './row-type-triggers/negative'
import { relatedPersonsTypesTriggers } from './row-type-triggers/related-persons'

export const dataGroupRowTypesMap: Record<DataGroupKey, string[]> = {
  common: Object.keys(commonTypesTriggers),
  personal: Object.keys(personalTypesTriggers),
  contacts: Object.keys(contactsTypesTriggers),
  relatedPersons: Object.keys(relatedPersonsTypesTriggers),
  addresses: Object.keys(addressesTypesTriggers),
  jobs: Object.keys(jobsTypesTriggers),
  education: Object.keys(educationTypesTriggers),
  vehicles: Object.keys(vehiclesTypesTriggers),
  movements: Object.keys(movementsTypesTriggers),
  negative: Object.keys(negativeTypesTriggers),
  unknown: [],
}
