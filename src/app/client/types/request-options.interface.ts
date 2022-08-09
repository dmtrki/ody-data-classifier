import { ExternalFieldGroup } from './odyssey-api-params'

export interface ExternalMethodParams {
  path: string
  fields: ExternalFieldGroup
  substitutions?: {}
}

export interface ExternalMethodsMap {
  [internalMethodKey: string]: ExternalMethodParams
}

export interface RequestOptionsInterface {
  path: string
  body: ExternalFieldGroup
}
