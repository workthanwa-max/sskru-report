import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadToR2 } from '../../infrastructure/R2Service';
import { authenticate } from '../auth/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload
router.post('/', authenticate, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const fileUrl = await uploadToR2(req.file);
    
    res.json({
      status: 'success',
      data: {
        url: fileUrl
      }
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

export default router;
