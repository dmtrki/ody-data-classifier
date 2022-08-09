import { ApiClient } from './types/api-client.interface'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { fetch, Response } from 'undici'
import { OdysseyParamsFactory } from './odyssey-params.factory'
import { EnquiryMetaDto } from '../../enquiry/dtos/enquiry-meta.dto'
import { OdysseyCheckResponseDto } from './dtos/odyssey-check-response.dto'
import { OdysseyCreateResponseDto } from './dtos/odyssey-post-response.dto'
import { HttpException, Injectable, Logger } from '@nestjs/common'
import { ApiConfig } from './types/api-config'
import { InternalError } from '../filters/internal-error.exception'

@Injectable()
export class OdysseyClient implements ApiClient {
  public config: ApiConfig

  constructor(
    private requestFactory: OdysseyParamsFactory,
    private configService: ConfigService,
    private emitter: EventEmitter2
  ) {
    this.config = this.getConfig()
  }

  async create(meta: EnquiryMetaDto): Promise<OdysseyCreateResponseDto> {
    try {
      const requestOptions = this.requestFactory.make(meta)
      const requestBody = new URLSearchParams({
        ...(requestOptions.body as object),
        key: this.config.key,
      })
      const response = await fetch(this.config.url + requestOptions.path, {
        method: 'POST',
        body: requestBody,
      })
      return response.json()
    } catch (e) {
      throw new HttpException(e, 400)
    }
  }

  async check(qid: string): Promise<OdysseyCheckResponseDto> {
    try {
      const body = new URLSearchParams({
        qid: qid,
        key: this.config.key,
      })
      const response = await fetch(this.config.url, {
        method: 'POST',
        body: body,
      })
      return (await response.json()) as OdysseyCheckResponseDto
    } catch (e) {
      throw new InternalError(
        e,
        'checking failed',
        'OdysseyClient: async check(): 60'
      )
    }
  }

  async fetch(url: string): Promise<string> {
    try {
      const sourceResponse = await fetch(url)
      return await sourceResponse.text()
    } catch (e) {
      throw new InternalError(
        e,
        'Fetching failed',
        'OdysseyClient: async fetch(): 60'
      )
    }
  }

  isError(responseData: OdysseyCheckResponseDto): boolean {
    return !!(responseData.error || responseData.status === 'not_found')
  }

  private getConfig() {
    return {
      url: this.configService.get('EXTERNAL_API_URL'),
      key: this.configService.get('EXTERNAL_API_KEY'),
    }
  }
}
