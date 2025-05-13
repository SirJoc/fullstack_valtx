import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product, ProductImage } from 'generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  
  async saveImageRecord(productId: string, userId: string, imageUrl: string): Promise<ProductImage> {
    const product = await this.prisma.product.findFirst({
        where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${productId}" no encontrado.`);
    }
    if (product.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para añadir imágenes a este producto.');
    }

    try {
        const productImage = await this.prisma.productImage.create({
          data: {
            url: imageUrl, 
            productId: productId,
          },
        });
        return productImage;
    } catch(error) {
        console.error("Error saving image record:", error);
        throw new InternalServerErrorException('Error al guardar la información de la imagen en la base de datos.');
    }
  }

  async findProductImages(productId: string, userId: string): Promise<ProductImage[]> {
    const product = await this.prisma.product.findFirst({
        where: { id: productId, userId: userId }
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${productId}" no encontrado o no tienes permiso para verlo.`);
    }

    return this.prisma.productImage.findMany({
      where: { productId: productId }
    });
  }

  async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    const { nombre, categoria } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        nombre,
        categoria,
        userId
      }
    });
    return product;
  }

  async findAll(userId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        userId: userId,
      },
      include: {
        images: true,
      },
       orderBy: {
        nombre: 'asc',
      }
    });
  }

  async findOne(productId: string, userId: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${productId}" no encontrado.`);
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para acceder a este producto.');
    }

    return product;
  }

  async update(productId: string, userId: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.findOne(productId, userId); 

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...updateProductDto,
      },
       include: {
        images: true,
      },
    });

    return updatedProduct;
  }

  async remove(productId: string, userId: string): Promise<Product> {
    const productoParaVerificar = await this.findOne(productId, userId);
    if (!productoParaVerificar) {
        throw new NotFoundException(`Producto con ID ${productId} no encontrado o no tienes permiso para eliminarlo.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const imagenes = await tx.productImage.findMany({ 
        where: {
          productId: productId,
        },
      });

      for (const imagen of imagenes) {
        if (imagen.url) {
          try {
            const urlParts = imagen.url.split('/');
            const nombreArchivo = urlParts[urlParts.length - 1];
            const rutaArchivo = path.resolve(process.cwd(), 'public', 'uploads', 'product-images', nombreArchivo); 

            if (fs.existsSync(rutaArchivo)) {
              fs.unlinkSync(rutaArchivo);
            }
          } catch (errorArchivo) {
            console.error(`Error al eliminar el archivo físico para la URL ${imagen.url}:`, errorArchivo);
            throw new InternalServerErrorException(`Error al procesar las imágenes asociadas al producto.`);
          }
        }
      }

      await tx.productImage.deleteMany({
        where: {
          productId: productId,
        },
      });

      const productoEliminado = await tx.product.delete({
        where: {
          id: productId,
        },
      });

      return productoEliminado;
    });
  }
}