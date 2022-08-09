import { Injectable, Logger } from '@nestjs/common'
import { fetch } from 'undici'
import { PrismaService } from '../app/prisma/prisma.service'
import { HTMLElement, parse } from 'node-html-parser'

@Injectable()
export class UtilsService {
  constructor(private prisma: PrismaService, private logger: Logger) {}

  async fetchSourceHtml(url: string) {
    const fetchRawHtml = await fetch(url)
    return await fetchRawHtml.text()
  }

  public likeEnquiryRequest(html: string) {
    const likeEnquiryMethodsMap = {
      personal: 'Физ.лицо',
      itn: 'ИНН физ.лица',
      entity: 'ИНН юр.лица',
      phone: 'Телефон',
      passport: 'Паспорт физ.лица',
      plate: 'Номер авто',
    }
    const fieldsCard = new HTMLElement('body', {}, '', null)
      .set_content(
        parse(html)
          .childNodes.filter((node) => node instanceof HTMLElement)
          .shift()
      )
      .querySelector('.card-body')

    const likeMethod = fieldsCard.querySelector('.card-category').textContent,
      likeField = fieldsCard.querySelector('h5').textContent

    if (!likeMethod || !likeField) return

    const [method] = Object.entries(likeEnquiryMethodsMap).find(
      ([key, value]) => value == likeMethod
    )

    if (!method) return

    const enquiry = {
      method: method,
      fields: {},
    }

    if (method === 'personal') {
      const splitted = likeField.split(' ')
      enquiry.fields['lastname'] = splitted[0].trim()
      enquiry.fields['firstname'] = splitted[1].trim()
      enquiry.fields['patronymic'] = splitted[2].trim()
      enquiry.fields['birth'] = splitted[3].trim()
    } else {
      enquiry.fields = {
        query: likeField.trim(),
      }
    }

    return enquiry
  }

  async clearEnquiryCache(id) {
    return await this.prisma.row.deleteMany({
      where: {
        enquiryId: id,
      },
    })
  }
}
