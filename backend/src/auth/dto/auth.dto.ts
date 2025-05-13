import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
   @ApiProperty({required: true})
    @IsEmail({}, { message: 'Por favor enviar un email válido' }) // Validation: checks if it's an email
    @IsNotEmpty({ message: 'Email no debería estar vacío.' })
    email: string;
    @IsNotEmpty({ message: 'Password no debería estar vacío.' })
    @ApiProperty({required: true})
    password: string;
}