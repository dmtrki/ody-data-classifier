import { PersonalRequestDto } from '../../../enquiry/dtos/enquiry-request.dto'

export const toFullname = ({
  lastname,
  firstname,
  patronymic,
}: Partial<PersonalRequestDto>) => {
  return `${lastname.toLocaleUpperCase()} ${firstname.toLocaleUpperCase()} ${patronymic.toLocaleUpperCase()}`
}
