import express from 'express'
import { auth } from '../middleware/auth';
import { createAccount, fundAccount, transferFunds, withdrawFunds } from '../controller/account.controller'
const router = express.Router();

router.post('/create', auth, createAccount)
router.put('/fund', auth, fundAccount)
router.put('/withdraw', auth, withdrawFunds)
router.put('/transfer', auth, transferFunds)

export default router