import express, { Router } from 'express';
import { register } from '../controllers/registerController.js';

const router=express.Router();
router.post("/register",register);

export default router;