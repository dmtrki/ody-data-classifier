import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private apiKey
  constructor(private config: ConfigService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    return this.validateRequest(request)
  }

  private validateRequest(request: any) {
    const { headers } = request

    if (headers.apiKey) {
      if (headers.apiKey === this.apiKey) {
        return true
      } else {
        throw new NotFoundException('Wrong API-key')
      }
    } else {
      throw new NotFoundException('Auth faild')
    }
  }
}
