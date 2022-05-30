import express from 'express';
const router = express.Router();
import authLogin from '../controllers/authLogin.js';

router.route('/login').post(authLogin);

export default router;
