import { unionTypesMap } from '../../src/parser/maps/union-types-map'
import { PrismaClient } from '@prisma/client'

export const seedRowUnionTypes = async (skipNotEmpty = true) => {
  const prisma = new PrismaClient()
  const unionsMap = { ...unionTypesMap }
  const getUnionInput = (unionKey) => ({
    key: unionKey,
    types: {
      connect: unionTypesMap[unionKey].types.map((it) => ({ key: it })),
    },
    group: {
      connect: {
        key: unionTypesMap[unionKey].group,
      },
    },
  })

  try {
    const existsCount = await prisma.rowUnionType.count()
    if (skipNotEmpty && existsCount !== 0) {
      console.log('skipped row types seeding')
    } else {
      for (const unionKey in unionsMap) {
        const data = getUnionInput(unionKey)
        await prisma.rowUnionType.upsert({
          where: {
            key: data.key,
          },
          create: {
            ...data,
          },
          update: {
            ...data,
          },
        })
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}
