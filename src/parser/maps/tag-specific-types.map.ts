import { vehiclesTypesTriggers } from './row-type-triggers/vehicles'
import { jobsTypesTriggers } from './row-type-triggers/jobs'
import { movementsTypesTriggers } from './row-type-triggers/movements'
import { negativeTypesTriggers } from './row-type-triggers/negative'

export const tagSpecificTypesMap = {
  auto: {
    ...vehiclesTypesTriggers,
  },
  avia: {
    ...movementsTypesTriggers,
  },
  finances: {
    ...jobsTypesTriggers,
  },
  employer: {
    ...jobsTypesTriggers,
  },
  moscowResidents: {
    ...vehiclesTypesTriggers,
    ...movementsTypesTriggers,
    ...jobsTypesTriggers,
  },
  negative: {
    ...negativeTypesTriggers,
  },
}
