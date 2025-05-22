import express from 'express';
import { getUser, register, login, updateUser, deleteUser } from '../controller/UserController.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

router.get("/token", refreshToken);

router.get('/user', verifyToken, getUser);
router.get('/user/:id', getUser);
router.post('/login', login);
router.post('/register', register);
router.patch('/user/:id', verifyToken, updateUser);
router.delete('/user/:id', verifyToken, deleteUser);

export default router;