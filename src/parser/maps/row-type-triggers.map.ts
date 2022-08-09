import { commonTypesTriggers } from './row-type-triggers/common'
import { personalTypesTriggers } from './row-type-triggers/personal'
import { jobsTypesTriggers } from './row-type-triggers/jobs'
import { contactsTypesTriggers } from './row-type-triggers/contacts'
import { addressesTypesTriggers } from './row-type-triggers/addresses'
import { vehiclesTypesTriggers } from './row-type-triggers/vehicles'
import { educationTypesTriggers } from './row-type-triggers/education'
import { movementsTypesTriggers } from './row-type-triggers/movements'
import { negativeTypesTriggers } from './row-type-triggers/negative'
import { relatedPersonsTypesTriggers } from './row-type-triggers/related-persons'

export const moscowResidentsBlockContext = {
  context: {
    tags: ['moscowResidents'],
  },
}
export const notMoscowResidents = {
  not: { ...moscowResidentsBlockContext },
}
export const movementContext = {
  context: {
    tags: ['movement'],
  },
}

export const rowTypeTriggersMap = {
  ...commonTypesTriggers,
  ...personalTypesTriggers,
  ...contactsTypesTriggers,
  ...relatedPersonsTypesTriggers,
  ...jobsTypesTriggers,
  ...addressesTypesTriggers,
  ...vehiclesTypesTriggers,
  ...educationTypesTriggers,
  ...movementsTypesTriggers,
  ...negativeTypesTriggers,
}
