import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
// import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signUp(@Body() dto: AuthCredentialsDto): Promise<User> {
    return this.authService.signUp(dto);
  }
  @Post('signin')
  signIn(@Body() dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(dto);
  }
  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@Req() req) {
  //   console.log(req);
  //   return 'Protected route with guard!';
  // }
}
