import { Controller, Get, Response, StreamableFile } from '@nestjs/common'
import { createReadStream } from 'fs'
import { join } from 'path'

@Controller('unknown')
export class UnknownController {
  @Get('json')
  getUnknowns(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'src/utils/unknown/unknown.json')
    )
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="unknown.json"',
    })
    return new StreamableFile(file)
  }
}
