import express from 'express';
import { getSewaKamar, createSewaKamar, updateSewaKamar, deleteSewaKamar  } from '../controller/SewaKamarController.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

router.get("/token", refreshToken);

// Mendapatkan semua data SewaKamar
router.get('/sewa-kamar', verifyToken, getSewaKamar);
// Menambahkan data SewaKamar baru 
router.post('/sewa-kamar', verifyToken, createSewaKamar);
// Mengupdate data SewaKamar
router.put('/sewa-kamar/:id', verifyToken, updateSewaKamar);
// Menghapus data SewaKamar
router.delete('/sewa-kamar/:id', verifyToken, deleteSewaKamar);

export default router;