import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class AddProductImageDto {
  @ApiProperty({
    description: 'URL de la imagen a añadir al producto',
    example: 'https://ejemplo.com/imagen-producto.jpg',
    required: true,
  })
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida.' })
  @IsNotEmpty({ message: 'La URL no puede estar vacía.' })
  url: string;
}