export const ruDateStringFormatter = (value: string) => {
  return value
    .split('.')
    .map((it) => (it.length < 2 ? `0${it}` : it))
    .join('.')
}
