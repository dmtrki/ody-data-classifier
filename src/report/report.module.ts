import { Module } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportController } from './report.controller'
import { ReportTreeBuilder } from './report-tree.builder'
import { TreeLeafMapper } from './tree-leaf.mapper'
import { ResponseModule } from '../app/response/response.module'

@Module({
  imports: [ResponseModule],
  controllers: [ReportController],
  providers: [ReportService, ReportTreeBuilder, TreeLeafMapper],
  exports: [ReportService],
})
export class ReportModule {}
