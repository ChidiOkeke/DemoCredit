import express from 'express'
import { auth } from '../middleware/auth';
import { getAccountTransactions, getAllTransactions } from '../controller/transaction.controller';
const router = express.Router();

router.get('/', auth, getAllTransactions)
router.get('/:account_id', auth, getAccountTransactions)

export default router