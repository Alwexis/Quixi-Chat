import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import jwt from 'jsonwebtoken';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export class Util {
    static loadModules(folderPath, app) {
        fs.readdirSync(folderPath).forEach(async item => {
            const fullPath = path.join(folderPath, item);
            const stats = await fs.promises.stat(fullPath);
            if (stats.isDirectory()) {
                this.loadModules(fullPath, app); // Explorar los sub-directorios de forma recursiva
            } else if (stats.isFile() && item.endsWith('.js')) {
                const relativePath = path.relative(__dirname, fullPath);
                const { path: routePath, router } = await import(`./${relativePath}`);
                app.use(routePath, router);
            }
        });
        console.log('Módulos cargados')
    }

    static base64Decoder(base64Data, nombre) {
        const mimeType = Util.getExtensionFromB64(base64Data);
        const extension = Util.getImageTypeFromMimeType(mimeType);
    
        const newB64Data = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(newB64Data, 'base64');
        fs.writeFileSync(`uploads/${nombre}.${extension}`, buffer);
        return `${nombre}.${extension}`;
    }

    static getExtensionFromB64(base64Data) {
        const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,/);
        if (matches && matches.length > 1) {
          return matches[1];
        }
        return '';
    }
    
    static getImageTypeFromMimeType(mimeType) {
        const mimeTypeToImageTypeMap = {
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/gif': 'gif',
          // Agrega otros tipos MIME y tipos de imagen según sea necesario
        };
      
        return mimeTypeToImageTypeMap[mimeType] || '';
    }
}

export function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    const payload = jwt.verify(token, process.env.SECRET_WORD);
    req.username = payload.username;
    next();
}