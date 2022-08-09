import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class BaseObserver<IN> {
  protected collector: Set<IN>
  protected context: unknown
  protected instanceName: string

  constructor(protected readonly emitter: EventEmitter2) {
    this.collector = new Set()
    this.instanceName = this.constructor.name
  }

  next(input: IN): void {
    if (Array.isArray(input)) {
      this.collector = new Set([...this.collector, ...input])
    } else {
      this.collector.add(input)
    }
  }

  error(error): void {
    console.error(error)
  }

  abstract complete(): void
}
