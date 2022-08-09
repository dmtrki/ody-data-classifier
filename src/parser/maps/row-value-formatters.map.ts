import { upperCaseFormatter } from '../pipes/formatters/upper-case.formatter'
import { ruDateStringFormatter } from '../pipes/formatters/ru-date-string.formatter'
import { digitsOnlyFormatter } from '../pipes/formatters/digits-only.formatter'

export const rowValueFormattersMap = {
  fullname: [upperCaseFormatter],
  addressResidence: [upperCaseFormatter],
  addressRegistration: [upperCaseFormatter],
  birth: [ruDateStringFormatter],
  death: [ruDateStringFormatter],
  itn: [digitsOnlyFormatter],
  insurance: [digitsOnlyFormatter],
  passportSerialNum: [digitsOnlyFormatter],
  passportReleaseDate: [ruDateStringFormatter],
  phoneNum: [digitsOnlyFormatter],
  homePhone: [digitsOnlyFormatter],
  jobEmployerItn: [digitsOnlyFormatter],
  jobIncomeDate: [ruDateStringFormatter],
  driversLicenseReleaseDate: [ruDateStringFormatter],
  vehicleRegistrationDate: [ruDateStringFormatter],
  vehicleDeregistrationDate: [ruDateStringFormatter],
  educationDiplomaReleaseDate: [ruDateStringFormatter],
  movementDate: [ruDateStringFormatter],
}
