import express, { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { createAccountSchema, fundAccountSchema, options, transferFundsSchema, withdrawFundsSchema } from '../utils/utils'
import { Account } from '../interfaces/account.interface'
import { Transaction } from '../interfaces/transaction.interface'
import knex from 'knex'

const knexConfig = require('../../knexfile.js')
const database = knex(knexConfig.development);
const minute = 60.00

export async function createAccount(req: Request, res: Response, next: NextFunction) {
    const id = uuidv4()

    try {
        const validationResult = createAccountSchema.validate(req.body, options)
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message
            })
        }

        const duplicateAccount = await database<Account>('accounts').select('account_id').where('user_id', req.body.user_id).first()

        if (duplicateAccount) {
            return res.status(409).json({
                message: "Account already exists",
                duplicateAccount
            })
        }

        const record = await database<Account>('accounts').insert({
            account_id: id,
            user_id: req.body.user_id,
            account_status: req.body.account_status,
            account_balance: 0.0
        })

        res.status(201).json({
            message: "You have successfully created an account",
            success: true,
            account_id: id
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Failed to create an account',
            route: '/create',
            err
        })
    }
}

export async function fundAccount(req: Request, res: Response, next: NextFunction) {

    const transactionId = uuidv4()
    const transactionType = 'inwards'


    try {
        const validationResult = fundAccountSchema.validate(req.body, options)
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message
            })
        }

        if (req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Please enter a valid amount",
                amount: req.body.amount
            })
        }



        const oldAccountBalance = await database.select('account_balance').from<Account>('accounts').where('account_id', req.body.account_id).first()

        const newAccountBalance = Number((oldAccountBalance?.account_balance + req.body.amount).toFixed(2))

        const duplicateTransaction = await database<Transaction>('transactions')
            .select('created_at')
            .where('to_account_id', req.body.account_id)
            .andWhere('amount', req.body.amount)
            .orderBy('created_at', 'desc')
            .first()

        const timeDifferenceInSeconds = getTimeDifferenceInSeconds(duplicateTransaction.created_at)

        if (timeDifferenceInSeconds <= minute) {
            return res.status(400).json({
                err: "Duplicate transaction. Please try again soon"
            })
        }

        const date = new Date();

        await database<Transaction>('transactions').insert({
            transaction_id: transactionId,
            transaction_type: transactionType,
            from_account_id: req.body.account_id,
            to_account_id: req.body.account_id,
            date_issued: date.toISOString(),
            amount: req.body.amount
        })

        await database<Account>('accounts').where({ account_id: req.body.account_id }).update({
            account_balance: newAccountBalance
        })

        res.status(200).json({
            message: "You have successfully funded account",
            account_id: req.body.account_id,
            amount: req.body.amount,
            account_balance: newAccountBalance,
            success: true
        })

    } catch (err) {
        res.status(500).json({
            msg: 'Failed to fund account',
            route: '/fund',
            err
        })
    }
}

export async function withdrawFunds(req: Request, res: Response, next: NextFunction) {
    const transactionId = uuidv4()
    const transactionType = 'outwards'

    try {
        const validationResult = withdrawFundsSchema.validate(req.body, options)
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message
            })
        }

        if (req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Please enter a valid amount",
                amount: req.body.amount
            })
        }

        const oldAccountBalanceObject = await database.select('account_balance').from<Account>('accounts').where('account_id', req.body.account_id).first()
        const oldAccountBalanceValue = Number(oldAccountBalanceObject?.account_balance.toFixed(2));

        const duplicateTransaction = await database<Transaction>('transactions')
            .select('created_at')
            .where('from_account_id', req.body.account_id)
            .andWhere('amount', req.body.amount)
            .orderBy('created_at', 'desc')
            .first()

        const timeDifferenceInSeconds = getTimeDifferenceInSeconds(duplicateTransaction.created_at)

        if (timeDifferenceInSeconds <= minute) {
            return res.status(400).json({
                err: "Duplicate transaction. Please try again soon"
            })
        }

        const date = new Date();

        await database<Transaction>('transactions').insert({
            transaction_id: transactionId,
            transaction_type: transactionType,
            from_account_id: req.body.account_id,
            to_account_id: req.body.account_id,
            date_issued: date.toISOString(),
            amount: req.body.amount
        })


        if (oldAccountBalanceValue <= 0.0) {
            return res.status(400).json({
                err: "Insufficient funds in your account",
                amount: req.body.amount,
                account_balance: oldAccountBalanceValue
            })
        }

        if (oldAccountBalanceValue - req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Insufficient funds for this transaction",
                amount: req.body.amount,
                account_balance: oldAccountBalanceValue
            })
        }

        const newAccountBalance = Number((oldAccountBalanceValue - req.body.amount).toFixed(2))

        const record = await database<Account>('accounts').where({ account_id: req.body.account_id }).update({
            account_balance: newAccountBalance
        })



        res.status(200).json({
            message: "You have successfully withdrawn from your account",
            account_id: req.body.account_id,
            amount: req.body.amount,
            account_balance: newAccountBalance,
            success: true
        })

    } catch (err) {
        res.status(500).json({
            msg: 'Failed to withdraw from account',
            route: '/fund',
            err
        })
    }
}

export async function transferFunds(req: Request, res: Response, next: NextFunction) {
    const transactionId = uuidv4()
    const transactionType = 'transfer'

    try {
        const validationResult = transferFundsSchema.validate(req.body, options)
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message
            })
        }

        if (req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Please enter a valid amount",
                amount: req.body.amount
            })
        }

        if (req.body.from_account_id === req.body.to_account_id) {
            return res.status(400).json({
                err: "Sorry, you cannot transfer to yourself. Source and destination account are the same",
                account_id: req.body.to_account_id
            })
        }
        const sourceAccountBalanceObject = await database.select('account_balance', 'account_id').from<Account>('accounts').where('account_id', req.body.from_account_id).first()
        const sourceAccountBalanceValue = Number(sourceAccountBalanceObject?.account_balance.toFixed(2));

        const destinationAccountBalanceObject = await database.select('account_balance', 'account_id').from('accounts').where('account_id', req.body.to_account_id).first()
        const destinationAccountBalanceValue = Number(destinationAccountBalanceObject?.account_balance.toFixed(2));


        if (!sourceAccountBalanceObject?.account_id || !destinationAccountBalanceObject?.account_id) {
            return res.status(400).json({
                err: "Please enter valid account ids",
                from_account_id: req.body.from_account_id,
                to_account_id: req.body.to_account_id,
            })
        }

        if (sourceAccountBalanceValue <= 0.0) {
            return res.status(400).json({
                err: "Insufficient funds in your account",
                amount: req.body.amount,
                account_balance: sourceAccountBalanceValue
            })
        }

        if (sourceAccountBalanceValue - req.body.amount < 0.0) {
            return res.status(400).json({
                err: "Insufficient funds for this transaction",
                amount: req.body.amount,
                account_balance: sourceAccountBalanceValue
            })
        }

        const sourceNewAccountBalance = sourceAccountBalanceValue - req.body.amount
        const destinationNewAccountBalance = destinationAccountBalanceValue + req.body.amount

        const sourceNewAccountBalanceFloat = Number(sourceNewAccountBalance.toFixed(2))
        const destinationNewAccountBalanceFloat = Number(destinationNewAccountBalance.toFixed(2))

        await database.transaction(async trx => {

            await database<Account>('accounts')
                .where({ account_id: req.body.from_account_id })
                .update({ account_balance: sourceNewAccountBalanceFloat })
                .transacting(trx);

            await database<Account>('accounts')
                .where({ account_id: req.body.to_account_id })
                .update({ account_balance: destinationNewAccountBalanceFloat })
                .transacting(trx);
        });

        const duplicateTransaction = await database<Transaction>('transactions')
            .select('created_at')
            .where('from_account_id', req.body.from_account_id)
            .orWhere('to_account_id', req.body.to_account_id)
            .andWhere('amount', req.body.amount)
            .orderBy('created_at', 'desc')
            .first()

        const timeDifferenceInSeconds = getTimeDifferenceInSeconds(duplicateTransaction.created_at)

        if (timeDifferenceInSeconds <= minute) {
            return res.status(400).json({
                err: "Duplicate transaction. Please try again soon"
            })
        }

        const date = new Date();

        await database<Transaction>('transactions').insert({
            transaction_id: transactionId,
            transaction_type: transactionType,
            from_account_id: req.body.from_account_id,
            to_account_id: req.body.to_account_id,
            date_issued: date.toISOString(),
            amount: req.body.amount
        })

        res.status(200).json({
            message: "You have successfully transferred",
            from_account_id: req.body.from_account_id,
            to_account_id: req.body.to_account_id,
            amount: req.body.amount,
            source_account_balance: sourceNewAccountBalanceFloat,
            destination_account_balance: destinationNewAccountBalanceFloat,
            success: true
        })

    } catch (err) {
        res.status(500).json({
            msg: 'Failed to transfer to account',
            route: '/transfer',
            err
        })
    }
}

function getTimeDifferenceInSeconds(transactionTime: Date) {
    const lastTransactionTime = new Date(transactionTime)
    const newTransactionTime = new Date()
    const timeDifferenceInSeconds = (newTransactionTime.getTime() - lastTransactionTime.getTime()) / 1000;
    return timeDifferenceInSeconds
}


