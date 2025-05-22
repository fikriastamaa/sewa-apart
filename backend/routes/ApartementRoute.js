import express from 'express';
import { getApartemen, createApartemen, updateApartemen, deleteApartemen } from '../controller/ApartementController.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

router.get("/token", refreshToken);

// Mendapatkan semua data Apartement
router.get('/apartements', verifyToken, getApartemen);
router.get('/apartements/:id', verifyToken, getApartemen);
router.post('/apartements', verifyToken, createApartemen);
router.put('/apartements/:id', verifyToken, updateApartemen);
router.delete('/apartements/:id', verifyToken, deleteApartemen);


export default router;