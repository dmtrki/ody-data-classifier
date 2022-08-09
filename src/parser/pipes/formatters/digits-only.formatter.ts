export const digitsOnlyFormatter = (rawPhone: string) => {
  return rawPhone.replace(/\D/g, '')
}
