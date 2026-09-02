import express from 'express';
import { login } from '../controllers/authController.js';
import { register } from '../controllers/registerController.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

router.post('/login', auditLog('LOGIN', 'auth'), login);
router.post('/register', auditLog('CREATE', 'user'), register);

export default router;
