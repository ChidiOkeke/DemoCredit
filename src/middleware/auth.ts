import knex from 'knex';
import { Request, Response, NextFunction } from 'express'
import { User } from '../interfaces/user.interface'
import jwt from 'jsonwebtoken'


const secret = process.env.JWT_SECRET as string
const knexConfig = require('../../knexfile.js')
const database = knex(knexConfig.development);

export async function auth(req: Request | any, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({
                error: 'Kindly sign in as a user'
            })
        }
        const token = authorization?.slice(7, authorization.length) as string

        let verified = jwt.verify(token, secret);

        if (!verified) {
            return res.status(401).json({
                error: 'User not verified, you cant access this route'
            })
        }
        const { user_id } = verified as { [key: string]: string }

        const user = await database.select('*').from<User>('users').where('user_id', user_id).first()

        if (!user) {
            return res.status(404).json({
                error: 'User not verified'
            })
        }

        req.user = verified
        next()
    } catch (error) {
        res.status(403).json({
            error: 'User not logged in'
        })
    }
}