import { PipelineBlockDto } from '../../dtos/pipeline-block.dto'
import { isPersonalFields } from '../../../enquiry/dtos/enquiry-request.dto'
import { toFullname } from '../../../app/utils/functions/to-fullname'
import { fromRuDateString } from '../../../app/utils/functions/from-ru-date-string'
import { IdentitiesReflector } from '../identities-reflector'

export class OccursRelevanceQualifier {
  qualify(block: PipelineBlockDto, references: IdentitiesReflector) {
    let result = null
    if (isPersonalFields(block.enquiryRef.fields)) {
      references.getRefs().forEach((reference) => {
        const blockFullname = block.data.find((row) => row.type === 'fullname'),
          blockBirth = block.data.find((row) => row.type === 'birth')
        if (
          blockFullname &&
          blockBirth &&
          isPersonalFields(block.enquiryRef.fields)
        ) {
          const { lastname, firstname, patronymic, birth } =
              block.enquiryRef.fields,
            fullname = toFullname({ lastname, firstname, patronymic }),
            birthTime = fromRuDateString(birth).getTime(),
            blockBirthTime = fromRuDateString(blockBirth.value).getTime()
          if (
            blockFullname.value === fullname &&
            blockBirthTime === birthTime
          ) {
            result = reference.getFilledProps()
          }
        }
      })
    }
    return result
  }
}
