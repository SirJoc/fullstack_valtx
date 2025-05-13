// src/products/dto/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
    description: 'Nombre del producto',
    example: 'Soporte para Laptop',
    required: true,
    })
    @IsString({ message: 'El nombre debe ser texto.'})
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.'})
    nombre: string;

    @ApiProperty({
    description: 'Categoría del producto',
    example: 'Accesorios Electrónicos',
    required: true,
    })
    @IsString({ message: 'La categoría debe ser texto.'})
    @IsNotEmpty({ message: 'La categoría no puede estar vacía.'})
    categoria: string;
}