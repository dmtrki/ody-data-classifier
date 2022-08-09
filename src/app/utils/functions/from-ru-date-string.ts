export const fromRuDateString = (mmddyyydotted: string) => {
  if (typeof mmddyyydotted !== 'string') return mmddyyydotted
  const dateArray = mmddyyydotted.split('.').map((it) => parseInt(it))
  return new Date(dateArray[2], dateArray[1] - 1, dateArray[0])
}
