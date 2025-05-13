import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(@Body() data: LoginDto) {
        const token = await this.authService.validateUser(data.email, data.password);
        if (!token) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }
        return token;
    }
}
