import express from 'express';
import { getKamar, createKamar, updateKamar, deleteKamar } from '../controller/KamarController.js';

const router = express.Router();

// Mendapatkan semua data Kamar
router.get('/kamar', getKamar);
// Menambahkan data Kamar baru
router.post('/kamar', createKamar);
// Mengupdate data Kamar
router.put('/kamar/:id', updateKamar);
// Menghapus data Kamar
router.delete('/kamar/:id', deleteKamar);

export default router;
