import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createAccountSchema, options } from '../utils/utils'
import { Transaction } from '../interfaces/transaction.interface'
import knex from 'knex'

const knexConfig = require('../../knexfile.js')
const database = knex(knexConfig.development);


export async function getAllTransactions(req: Request, res: Response, next: NextFunction) {

    try {

        const transactions = await database<Transaction>('transactions').select('*')

        if (transactions.length > 0) {
            return res.status(200).json({
                count: transactions.length,
                success: true,
                transactions
            })
        } else {
            return res.status(400).json({
                message: 'No transactions found',
                success: false
            })
        }

    } catch (err) {
        res.status(500).json({
            msg: 'Failed to fetch all transactions',
            route: '/',
            err,
            success: false
        })
    }
}

export async function getAccountTransactions(req: Request, res: Response, next: NextFunction) {

    try {

        const transactions = await database<Transaction>('transactions')
            .select('*')
            .where('from_account_id', req.params.account_id)
            .orWhere('to_account_id', req.params.account_id)

        if (transactions.length > 0) {
            return res.status(200).json({
                count: transactions.length,
                success: true,
                transactions
            })
        } else {
            return res.status(400).json({
                message: 'No transactions found',
                success: false
            })
        }

    } catch (err) {
        res.status(500).json({
            msg: 'Failed to fetch account transactions',
            route: '/',
            err,
            success: false
        })
    }
}
