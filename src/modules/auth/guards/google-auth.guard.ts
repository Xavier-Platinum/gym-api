/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return true;
  }
}