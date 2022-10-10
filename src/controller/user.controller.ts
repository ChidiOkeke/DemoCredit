import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { registerSchema, options, loginSchema, generateToken } from '../utils/utils'
import { User } from '../interfaces/user.interface'
import bcrypt from 'bcryptjs'
import knex from 'knex'

const knexConfig = require('../../knexfile.js')
const database = knex(knexConfig.development);


export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const validationResult = registerSchema.validate(req.body, options)
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            })
        }

        const duplicatEmail = await database<User>('users').select('email').where('email', req.body.email)

        if (duplicatEmail.length > 0) {
            return res.status(409).json({
                message: "Email is already in use. Please change email"
            })
        }

        const duplicatePhone = await database<User>('users').select('phone_number').where('phone_number', req.body.phone_number)

        if (duplicatePhone.length > 0) {
            return res.status(409).json({
                message: "Phone number is already in use. Please change phone number"
            })
        }
        const passwordHash = await bcrypt.hash(req.body.password, 8)

        const record = await database<User>('users').insert({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            date_of_birth: req.body.date_of_birth,
            phone_number: req.body.phone_number,
            password: passwordHash
        })

        res.status(201).json({
            message: "You have successfully created a user",
            record
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed to register user',
            route: '/register',
            err
        })
    }
}

// export async function loginUser(req: Request, res: Response, next: NextFunction) {
//     const id = uuidv4()
//     try {
//         const validationResult = loginSchema.validate(req.body, options)
//         if (validationResult.error) {
//             return res.status(400).json({
//                 Error: validationResult.error.details[0].message
//             })
//         }
//         const User = await UserInstance.findOne({ where: { email: req.body.email } }) as unknown as { [key: string]: string }
//         const { id } = User
//         const token = generateToken({ id })
//         const validUser = await bcrypt.compare(req.body.password, User.password);

//         if (!validUser) {
//             res.status(401).json({
//                 message: "Password do not match"
//             })
//         }

//         if (validUser) {
//             res.status(200).json({
//                 message: "Successfully logged in",
//                 token,
//                 User

//             })
//         }

//     } catch (err) {
//         res.status(500).json({
//             msg: 'failed to login',
//             route: '/login'
//         })
//     }

// }
