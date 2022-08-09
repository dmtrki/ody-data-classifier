import { seeddataGroups } from './row-type-groups.seeder'
import { seedRowTypes } from './row-types.seeder'
import { seedRowUnionTypes } from './row-union-types.seeder'

async function seed() {
  await seeddataGroups()
  await seedRowTypes(false)
  await seedRowUnionTypes(false)
}

seed()
