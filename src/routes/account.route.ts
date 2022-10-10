import express from 'express'
import { auth } from '../middleware/auth';
import { createAccount, fundAccount, transferFunds, withdrawFunds } from '../controller/account.controller'
const router = express.Router();

router.post('/create', auth, createAccount)
router.post('/fund', auth, fundAccount)
router.post('/withdraw', auth, withdrawFunds)
router.post('/transfer', auth, transferFunds)

export default router