import express from 'express'
import authController from '../controllers/auth.c.mjs'
import authenticateToken from '../middlewares/middleware.mjs'

const router = express.Router()

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/logout', authController.logout);

router.post('/refresh', authController.refresh);

router.get('/session', authenticateToken, authController.session);

export default router;