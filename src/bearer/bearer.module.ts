import { Global, Logger, Module } from '@nestjs/common'
import { BearerService } from './bearer.service'
import { ParserCompleteListener } from '../parser/listeners/parser-complete.listener'
import { RowAdapterMapper } from './models/row/row-adapter.mapper'
import { ModelFactory } from './model.factory'
import { EnquiryModel } from './models/enquiry.model'
import { IdentityModel } from './models/identity/identity.model'
import { RowModel } from './models/row/row.model'
import { RowUnionModel } from './models/row-union/row-union.model'
import { BaseModel } from './models/base.model'

@Global()
@Module({
  imports: [Logger],
  providers: [
    Logger,
    BearerService,
    ModelFactory,
    RowAdapterMapper,
    EnquiryModel,
    IdentityModel,
    RowModel,
    RowUnionModel,
  ],
  exports: [BearerService, ModelFactory, EnquiryModel, IdentityModel],
})
export class BearerModule {}
