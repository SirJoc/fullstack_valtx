import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique( { where: {email: email}});
        if (!user) {
            return null;
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (user && isPasswordMatching) {
            return { email, token: this.jwtService.sign({ email: user.email, sub: user.id })};
        }
        return null;
    }
}
