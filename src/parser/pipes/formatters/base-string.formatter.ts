export const baseStringFormatter = (string: string) => {
  if (string.search(/[\da-zA-Zа-яЁ](_)[\da-zA-Zа-яЁ]/gmu)) {
    string = string.replace('_', ' ')
  }
  return string.trim()
}
