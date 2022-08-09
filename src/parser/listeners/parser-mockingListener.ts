import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { writeFile } from 'fs'

@Injectable()
export class ParserMockingListener {
  @OnEvent('parser.mocking')
  mockParsed(payload) {
    const data = [...payload]
    console.log(
      `./src/parser/results/${data[0]?.enquiryRef?.id ?? data[0]?.hash}.json`
    )
    writeFile(
      `./src/parser/results/${data[0]?.enquiryRef?.id ?? data[0]?.hash}.json`,
      JSON.stringify(data),
      'utf-8',
      (error) => {
        if (error) throw error
      }
    )
  }
}
