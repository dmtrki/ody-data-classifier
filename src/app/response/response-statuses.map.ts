export const errorStatusesMap = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  ERROR: 500,
}

export const successStatusesMap = {
  ACCEPTED: 201,
  WAITING: 200,
  PROCESSING: 200,
  COMPLETE: 200,
}

export const responseStatusesMap = {
  ...successStatusesMap,
  ...errorStatusesMap,
}

export type ErrorResponseStatusKey = keyof typeof errorStatusesMap
export type ErrorResponseStatusCode =
  typeof errorStatusesMap[ErrorResponseStatusKey]
export type SuccessResponseStatusKey = keyof typeof successStatusesMap
export type SuccessResponseStatusCode =
  typeof errorStatusesMap[ErrorResponseStatusKey]
export type ResponseStatusKey = keyof typeof responseStatusesMap
export type ResponseStatusCode = typeof responseStatusesMap[ResponseStatusKey]
