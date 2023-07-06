import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(id: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(id);
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!user.password || !isMatch) {
            throw new UnauthorizedException();
        }
        
        const payload = { sub: user.id, firstName: user.firstName, lastName: user.lastName};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
