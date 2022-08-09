import { ReportTreeLeafDto } from './dtos/report-tree-leaf-dto'
import { DataGroupKeysEnum } from '../parser/maps/data-groups.enum'
import { ObjectKeydUtils } from '../app/utils/object-keyd'
import { DataTree } from './types/data-tree'
import { unionTypesMap } from '../parser/maps/union-types-map'
import { Injectable } from '@nestjs/common'
import { InjectMapper } from '@automapper/nestjs'
import { addProfile, Mapper } from '@automapper/core'
import { TreeLeafMapper } from './tree-leaf.mapper'
import { TreeSourceDto } from './dtos/tree-source.dto'

@Injectable()
export class ReportTreeBuilder {
  private tree: DataTree
  private readonly treeManager: ObjectKeydUtils = new ObjectKeydUtils()
  private rowsHashCache = new Map<string, number>()

  constructor(
    @InjectMapper() private mapper: Mapper,
    private mapperProfile: TreeLeafMapper
  ) {}

  public getTree(): DataTree {
    return this.tree
  }

  public distributeRows(rows: TreeSourceDto[]): this {
    this.tree = this.initRoots()
    this.treeManager.target(this.tree)
    this.rowsHashCache.clear()
    for (const row of rows) {
      const leaf = this.mapper.map(row, TreeSourceDto, ReportTreeLeafDto)
      this.add(leaf)
    }
    return this
  }

  public add(row): false | this {
    if (this.visitCache(row.hash)) return false

    return this.pushRow(row)
  }

  private pushRow(row): this {
    const path = this.makePath(row)
    const { value } = row
    if (this.isDuplicateRow(this.treeManager.get(path), value)) return
    this.treeManager.set(path, [
      {
        value,
        createdAt: row.createdAt,
        identityId: row.identityId,
        meta: row.meta,
      },
    ])
    return this
  }

  private makePath(row: ReportTreeLeafDto): string {
    return ['group', 'union', 'from', 'type']
      .map((partKey) =>
        partKey === 'from' && !row.union ? null : row[partKey]
      )
      .filter((part) => !!part)
      .join('.')
  }

  private isDuplicateRow(where, value): boolean {
    return Array.isArray(where) && where.find((row) => row.value === value)
  }

  private visitCache(hash: string): boolean {
    const count = this.rowsHashCache.get(hash) ?? 0
    this.rowsHashCache.set(hash, count + 1)
    return !!count
  }

  private initRoots(): DataTree {
    const roots = {} as DataTree
    for (const group in DataGroupKeysEnum) {
      roots[group] = {}
    }
    return roots
  }
}
