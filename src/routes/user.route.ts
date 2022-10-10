import express from 'express'
const router = express.Router();
import { registerUser } from '../controller/user.controller'

router.post('/register', registerUser)


export default router