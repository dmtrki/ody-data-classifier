import { Global, Logger, Module } from '@nestjs/common'
import { OdysseyClient } from './odyssey.client'
import { OdysseyParamsFactory } from './odyssey-params.factory'

@Global()
@Module({
  providers: [OdysseyClient, OdysseyParamsFactory, Logger],
  exports: [OdysseyClient],
})
export class ClientModule {}
