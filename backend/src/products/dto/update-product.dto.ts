
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({ 
      description: 'Nombre completo del producto (requerido para reemplazo)', 
      example: 'Soporte Ajustable para Laptop Pro',
      required: true, 
    })
    @IsString({ message: 'El nombre debe ser texto.'})
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.'}) 
    nombre: string; 
  
    @ApiProperty({ 
      description: 'Categoría completa del producto (requerida para reemplazo)', 
      example: 'Ergonomía de Oficina Avanzada',
      required: true,
    })
    @IsString({ message: 'La categoría debe ser texto.'})
    @IsNotEmpty({ message: 'La categoría no puede estar vacía.'}) 
    categoria: string; 
  }