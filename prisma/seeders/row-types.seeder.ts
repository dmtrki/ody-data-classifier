import { dataGroupRowTypesMap } from '../../src/parser/maps/data-group-row-types-map'
import { Prisma, PrismaClient } from '@prisma/client'

export const seedRowTypes = async (skipNotEmpty = true) => {
  const prisma = new PrismaClient()

  try {
    const existsCount = await prisma.rowType.count()
    if (skipNotEmpty && existsCount !== 0) {
      console.log('skipped row types seeding')
    } else {
      for (const groupKey in dataGroupRowTypesMap) {
        const rowTypeInputs = dataGroupRowTypesMap[groupKey].map(
          (typeKey: string) => {
            return {
              key: typeKey,
              group: {
                connect: {
                  key: groupKey,
                },
              },
            } as Prisma.RowTypeCreateInput
          }
        )

        for (const rowType of rowTypeInputs) {
          await prisma.rowType.upsert({
            where: {
              key: rowType.key,
            },
            create: {
              ...rowType,
            },
            update: {
              group: {
                connect: {
                  key: groupKey,
                },
              },
            },
          })
        }
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}
