import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private readonly jwtService: JwtService) {} 

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    
    // Ensure authorization header exists and is correctly formatted
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing authorization header');
    }

    const token:string = authorization.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    // Define the payload interface for the token
    interface Payload {
      sub: number;
      username: string;
    }

    try {
      console.log('token: ', token);
      const payload: Payload = await this.jwtService.verifyAsync(token);
      request.user = { id: payload['sub'], username: payload['username'] };
      return true;
    } catch (err) {
      console.error('Token validation error:', err);
      throw new UnauthorizedException('Invalid token');
    }
    
  }
}
