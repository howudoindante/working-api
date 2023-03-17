import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { TOKENFIELD } from '../../config/config';
import { MiddlewarePayload } from '../../types/guards.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public middleware?: (data: MiddlewarePayload) => boolean) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(request: any): boolean {
    try {
      const token = request.cookies[TOKENFIELD];
      if (token) {
        const t = new JwtService().decode(token);

        if (t) {
          if (this.middleware) {
            return this.middleware({
              request,
              token: {
                origin: token,
                decoded: t,
              },
            });
          } else {
            return true;
          }
        }
      } else {
        throw new Error('Token exception');
      }
    } catch (e) {
      return false;
    }
  }
}
