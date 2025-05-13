import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe, BadRequestException, Req, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorageConfig, imageFileFilter } from 'src/config/multer-config';

@ApiTags('Productos') 
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.'})
  @ApiResponse({ status: 401, description: 'No autorizado.'}) 
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta (Error de validación).' }) 
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser('userId') userId: string,
  ) {
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos del usuario autenticado' }) 
  @ApiResponse({ status: 200, description: 'Lista de productos del usuario.'}) 
  @ApiResponse({ status: 401, description: 'No autorizado.'}) 
  findAll(@GetUser('userId') userId: string) {
    return this.productsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto específico por ID' }) 
  @ApiParam({ name: 'id', description: 'UUID del Producto', type: String }) 
  @ApiResponse({ status: 200, description: 'Detalles del producto.'}) 
  @ApiResponse({ status: 401, description: 'No autorizado.'}) 
  @ApiResponse({ status: 403, description: 'Prohibido (El producto no pertenece al usuario).' }) 
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'}) 
  findOne(
    @Param('id', ParseUUIDPipe) productId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.productsService.findOne(productId, userId);
  }

  @Put(':id') // <-- CHANGED FROM @Patch to @Put
  @ApiOperation({ summary: 'Reemplazar completamente un producto específico por ID' }) // <-- UPDATED SUMMARY
  // highlight-end
  @ApiParam({ name: 'id', description: 'UUID del Producto', type: String })
  @ApiResponse({ status: 200, description: 'Producto reemplazado exitosamente.'}) // <-- UPDATED DESCRIPTION
  @ApiResponse({ status: 401, description: 'No autorizado.'})
  @ApiResponse({ status: 403, description: 'Prohibido (El producto no pertenece al usuario).' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'})
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta (Error de validación o campos faltantes).' }) // <-- UPDATED DESCRIPTION
  update(
    @Param('id', ParseUUIDPipe) productId: string,
    @GetUser('userId') userId: string,
    @Body() updateProductDto: UpdateProductDto, // DTO now expects all fields
  ) {
    return this.productsService.update(productId, userId, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto específico por ID' }) 
  @ApiParam({ name: 'id', description: 'UUID del Producto', type: String }) 
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.'}) 
  @ApiResponse({ status: 401, description: 'No autorizado.'}) 
  @ApiResponse({ status: 403, description: 'Prohibido (El producto no pertenece al usuario).' }) 
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'}) 
  remove(
    @Param('id', ParseUUIDPipe) productId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.productsService.remove(productId, userId);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Sube un archivo de imagen y lo asocia a un producto existente' }) 
  @ApiConsumes('multipart/form-data')
  @ApiBody({ 
    description: 'Archivo de imagen a subir (jpg, jpeg, png, gif, webp)',
    schema: {
      type: 'object',
      properties: {
        file: { 
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file']
    },
  })
  @ApiParam({ name: 'id', description: 'UUID del Producto al que añadir la imagen', type: String })
  @ApiResponse({ status: 201, description: 'Imagen subida y asociada exitosamente.'}) 
  @ApiResponse({ status: 401, description: 'No autorizado.'})
  @ApiResponse({ status: 403, description: 'Prohibido (El producto no pertenece al usuario).' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'})
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta (Archivo no válido o faltante).' })
  @UseInterceptors(FileInterceptor('file', { 
      storage: multerStorageConfig,      
      fileFilter: imageFileFilter,       
      limits: { fileSize: 1024 * 1024 * 5 }
  }))
  async uploadProductImage(
      @Param('id', ParseUUIDPipe) productId: string,
      @GetUser('userId') userId: string,
      @UploadedFile() file: Express.Multer.File, 
      @Req() req: any 
  ) {
      if (!file) {
          throw new BadRequestException('Archivo no encontrado o no válido.'); 
      }

      const protocol = req.protocol;
      const host = req.get('Host'); 
      const imageUrl = `${protocol}://${host}/uploads/product-images/${file.filename}`;

      return this.productsService.saveImageRecord(productId, userId, imageUrl);
  }

   @Get(':id/images')
    @ApiOperation({ summary: 'Listar las URLs de las imágenes de un producto específico' })
    @ApiParam({ name: 'id', description: 'UUID del Producto cuyas imágenes listar', type: String })
    @ApiResponse({ status: 200, description: 'Lista de imágenes del producto.'})
    @ApiResponse({ status: 401, description: 'No autorizado.'})
    @ApiResponse({ status: 403, description: 'Prohibido (El producto no pertenece al usuario).' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado o sin permiso.'})
    getImages(
        @Param('id', ParseUUIDPipe) productId: string,
        @GetUser('userId') userId: string,
    ) {
        return this.productsService.findProductImages(productId, userId);
    }
}
