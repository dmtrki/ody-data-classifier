export const MovementTypes = {
  auto: 'автомобиль',
  railway: 'ж/д',
  avia: 'авиаперелет',
  taxi: 'такси',
}

export const tagsToMovementType = (tags: string[]): string => {
  if (!tags.length) return
  return tags.includes('avia')
    ? MovementTypes.avia
    : tags.includes('railway')
    ? MovementTypes.railway
    : tags.includes('auto')
    ? MovementTypes.auto
    : null
}
