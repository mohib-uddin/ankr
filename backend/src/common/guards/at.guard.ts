import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    const requiredTokenAuth = this.reflector.getAllAndOverride<string[]>('tokenAuth', [context.getHandler(), context.getClass()]);
    if (requiredTokenAuth) {
      if (request.headers['authorization']) return super.canActivate(context);
      else {
        if (!request.query.t) throw new UnauthorizedException('No token provided');
        return true;
      }
    }

    return super.canActivate(context);
  }
}
