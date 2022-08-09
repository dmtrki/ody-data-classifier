import { from } from 'rxjs'
import { TriggerEffector } from '../types/trigger-effects'

export const destructPassport: TriggerEffector = (row) => {
  return row
}

export const destructPassportUnit: TriggerEffector = async (row) => {
  return row
}
