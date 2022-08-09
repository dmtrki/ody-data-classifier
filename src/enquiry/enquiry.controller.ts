import { Body, Controller, Post } from '@nestjs/common'
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger'
import {
  EmailRequestDto,
  EntityRequestDto,
  InsuranceRequestDto,
  ItnRequestDto,
  PassportRequestDto,
  PersonalRequestDto,
  PhoneRequestDto,
  PlateRequestDto,
  VinRequestDto,
} from './dtos/enquiry-request.dto'
import { EnquiryService } from './enquiry.service'
import { EnquiryApiMethod } from './enquiry-api-method.decorator'
import { EnquiryAcceptedDto } from './dtos/enquiry-accepted.dto'

@Controller('enquiry')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@ApiTags('enquiry')
export class EnquiryController {
  constructor(private service: EnquiryService) {}

  @Post('personal')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных по ФИО и дате рождения',
    PersonalRequestDto
  )
  personalEnquiry(
    @Body() body: PersonalRequestDto
  ): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('personal', body)
  }

  @Post('phone')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных по абонентскому номеру',
    PhoneRequestDto
  )
  phoneEnquiry(@Body() body: PhoneRequestDto): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('phone', body)
  }

  @Post('email')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных по email',
    EmailRequestDto
  )
  emailEnquiry(@Body() body: EmailRequestDto): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('email', body)
  }

  @Post('passport')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных по серии и номеру пасспорта',
    PassportRequestDto
  )
  passportEnquiry(
    @Body() body: PassportRequestDto
  ): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('passport', body)
  }

  @Post('itn')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных физического лица по ИНН',
    ItnRequestDto
  )
  itnEnquiry(@Body() body: ItnRequestDto): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('itn', body)
  }

  @Post('insurance')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных по номеру СНИЛС',
    InsuranceRequestDto
  )
  insuranceEnquiry(
    @Body() body: InsuranceRequestDto
  ): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('insurance', body)
  }

  @Post('plate')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных по гос. номеру автомобиля',
    PlateRequestDto
  )
  plateEnquiry(@Body() body: PlateRequestDto): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('plate', body)
  }

  @Post('vin')
  @EnquiryApiMethod('Отправка запроса на поиск данных по VIN', VinRequestDto)
  vinEnquiry(@Body() body: VinRequestDto): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('vin', body)
  }

  @Post('entity')
  @EnquiryApiMethod(
    'Отправка запроса на поиск данных юридического лица по ИНН или ОГРН',
    EntityRequestDto
  )
  entityEnquiry(@Body() body: EntityRequestDto): Promise<EnquiryAcceptedDto> {
    return this.service.handleIncoming('entity', body)
  }
}
