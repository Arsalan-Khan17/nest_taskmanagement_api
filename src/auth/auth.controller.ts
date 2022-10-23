import { Body, Controller, Inject, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(
   
    private authService:AuthService){}
    @Post('signup')
    signup(@Body(ValidationPipe) authcreentials:AuthCredentials){
        return this.authService.signup(authcreentials);
    }

    @Post('signin')
    signin(@Body(ValidationPipe) authcreentials:AuthCredentials):Promise<{accessToken:string}>{
        return this.authService.signIn(authcreentials);
    }

    @Post('test')
    @UseGuards(AuthGuard())

    test(@Req() req){
        console.log(req);
    }
}
