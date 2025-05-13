import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs'; 

const destinationPath = join(__dirname, '..', '..', 'uploads', 'product-images');

const ensureDirectoryExistence = (filePath: string) => {
  const dirname = filePath; 
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true }); 
};

export const multerStorageConfig = diskStorage({
  destination: (req, file, cb) => {
    ensureDirectoryExistence(destinationPath);
    cb(null, destinationPath); 
  },
  filename: (req, file, cb) => {
    const randomName = uuidv4();
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

export const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error('¡Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)!'), false);
  }
  cb(null, true);
};