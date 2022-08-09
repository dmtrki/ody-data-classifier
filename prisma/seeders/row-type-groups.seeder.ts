import { PrismaClient } from '@prisma/client'
import { dataGroupsMap } from '../../src/parser/maps/row-type-groups.map'

export const seeddataGroups = async () => {
  const prisma = new PrismaClient()
  try {
    if ((await prisma.dataGroup.count()) === 0) {
      const dataGroupsInput = Object.values(dataGroupsMap).map((it) => {
        const { alias: alias, ...rest } = it
        return rest
      })
      await prisma.dataGroup.createMany({
        data: dataGroupsInput,
      })
    } else {
      console.log('skipped data groups seeding')
    }
  } finally {
    await prisma.$disconnect()
  }
}
