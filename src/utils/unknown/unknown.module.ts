import { Module } from '@nestjs/common'
import { UnknownService } from './unknown.service'
import { UnknownController } from './unknown.controller'

@Module({
  providers: [UnknownService],
  controllers: [UnknownController],
})
export class UnknownModule {}
