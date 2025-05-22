import express from 'express';
import { getKamar, createKamar, updateKamar, deleteKamar } from '../controller/KamarController.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

router.get("/token", refreshToken);

// Mendapatkan semua data Kamar
router.get('/kamar', verifyToken, getKamar);
// Menambahkan data Kamar baru
router.post('/kamar', verifyToken, createKamar);
// Mengupdate data Kamar
router.put('/kamar/:id', verifyToken, updateKamar);
// Menghapus data Kamar
router.delete('/kamar/:id', verifyToken, deleteKamar);

export default router;
