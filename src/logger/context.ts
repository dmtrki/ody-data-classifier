import { isNil, isUndefined } from '@nestjs/common/utils/shared.utils'

export default class LogContext {
  public type?: string
  public producer?: string
  public user?: { id: string; name: string }

  constructor(
    {
      type,
      producer,
      user,
    }: {
      type?: string
      producer?: string
      user?: { id: string; name: string }
    } = { type: undefined, producer: undefined, user: undefined }
  ) {
    const args = arguments[0]

    for (const key of Object.keys(args)) {
      if (!(isNil(args[key]) || isUndefined(args[key]))) {
        this[key] = args[key]
      }
    }
  }
}
