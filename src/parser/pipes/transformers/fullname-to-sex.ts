const nameDetector = require('russian-name-detector')()

export enum RowTypeSexEnum {
  MALE = 'мужской',
  FEMALE = 'женский',
}

export async function fullnameToSex(
  fullname: string
): Promise<RowTypeSexEnum | null> {
  const { sex } = await nameDetector(fullname)
  if (!sex) return null
  return sex === 'm' ? RowTypeSexEnum.MALE : RowTypeSexEnum.FEMALE
}
