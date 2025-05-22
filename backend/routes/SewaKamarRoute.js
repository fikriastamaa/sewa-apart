import express from 'express';
import { getSewaKamar, createSewaKamar, updateSewaKamar, deleteSewaKamar  } from '../controller/SewaKamarController.js';

const router = express.Router();

// Mendapatkan semua data SewaKamar
router.get('/sewa-kamar', getSewaKamar);
// Menambahkan data SewaKamar baru 
router.post('/sewa-kamar', createSewaKamar);
// Mengupdate data SewaKamar
router.put('/sewa-kamar/:id', updateSewaKamar);
// Menghapus data SewaKamar
router.delete('/sewa-kamar/:id', deleteSewaKamar);

export default router;