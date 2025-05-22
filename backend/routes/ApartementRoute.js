import express from 'express';
import { getApartemen, createApartemen, updateApartemen, deleteApartemen } from '../controller/ApartementController.js';

const router = express.Router();

// Mendapatkan semua data Apartement
router.get('/apartements', getApartemen);
router.get('/apartements/:id', getApartemen);
router.post('/apartements', createApartemen);
router.put('/apartements/:id', updateApartemen);
router.delete('/apartements/:id', deleteApartemen);


export default router;