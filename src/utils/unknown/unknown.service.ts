import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { readFile, writeFile, existsSync } from 'fs'
import { PipelineBlockDto } from '../../parser/dtos/pipeline-block.dto'

@Injectable()
export class UnknownService {
  private unknownPath = './src/utils/unknown/unknown.json'

  @OnEvent('unknown.coming')
  onUnknowns(payload: Set<PipelineBlockDto>) {
    if (!existsSync(this.unknownPath)) {
      writeFile(this.unknownPath, '{}', (error) => {
        console.log('created unknown.json')
        if (error) console.log(error)
        this.writeUnknowns([...payload])
      })
    } else {
      this.writeUnknowns([...payload])
    }
  }

  writeUnknowns(payload) {
    readFile(this.unknownPath, 'utf8', (error, data) => {
      if (error) console.error(error)
      if (!payload.length) {
        return
      }
      const storageData = JSON.parse(data) ?? {}
      storageData[payload[0]?.enquiryRef?.id ?? payload[0].hash] = payload
      const updatedData = JSON.stringify(storageData)
      writeFile(this.unknownPath, updatedData, 'utf-8', (error) => {
        if (error) throw error
      })
    })
  }
}
