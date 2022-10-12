"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferFunds = exports.withdrawFunds = exports.fundAccount = exports.createAccount = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const knex_1 = __importDefault(require("knex"));
const knexConfig = require('../../knexfile.js');
const database = (0, knex_1.default)(knexConfig.development);
const minute = 60.00;
async function createAccount(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.createAccountSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message,
                success: false
            });
        }
        const duplicateAccount = await database('accounts').select('account_id').where('user_id', req.body.user_id).first();
        if (duplicateAccount) {
            return res.status(409).json({
                message: "Account already exists",
                duplicateAccount,
                success: false,
            });
        }
        const record = await database('accounts').insert({
            account_id: id,
            user_id: req.body.user_id,
            account_status: req.body.account_status,
            account_balance: 0.0
        });
        res.status(201).json({
            message: "You have successfully created an account",
            success: true,
            account_id: id
        });
    }
    catch (err) {
        res.status(500).json({
            msg: 'Failed to create an account',
            route: '/create',
            err,
            success: false
        });
    }
}
exports.createAccount = createAccount;
async function fundAccount(req, res, next) {
    const transactionId = (0, uuid_1.v4)();
    const transactionType = 'inwards';
    try {
        const validationResult = utils_1.fundAccountSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message,
                success: false
            });
        }
        if (req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Please enter a valid amount",
                amount: req.body.amount,
                success: false
            });
        }
        const oldAccountBalance = await database.select('account_balance').from('accounts').where('account_id', req.body.account_id).first();
        const newAccountBalance = Number((oldAccountBalance?.account_balance + req.body.amount).toFixed(2));
        const duplicateTransaction = await database('transactions')
            .select('created_at')
            .where('to_account_id', req.body.account_id)
            .andWhere('amount', req.body.amount)
            .orderBy('created_at', 'desc')
            .first();
        if (duplicateTransaction) {
            const timeDifferenceInSeconds = getTimeDifferenceInSeconds(duplicateTransaction.created_at);
            if (timeDifferenceInSeconds <= minute) {
                return res.status(400).json({
                    err: "Duplicate transaction. Please try again soon",
                    success: false
                });
            }
        }
        const date = new Date();
        await database('accounts').where({ account_id: req.body.account_id }).update({
            account_balance: newAccountBalance
        });
        res.status(200).json({
            message: "You have successfully funded account",
            account_id: req.body.account_id,
            amount: req.body.amount,
            account_balance: newAccountBalance,
            success: true
        });
        await database('transactions').insert({
            transaction_id: transactionId,
            transaction_type: transactionType,
            from_account_id: req.body.account_id,
            to_account_id: req.body.account_id,
            date_issued: date.toLocaleString('en-GB'),
            amount: req.body.amount
        });
    }
    catch (err) {
        res.status(500).json({
            msg: 'Failed to fund account',
            route: '/fund',
            success: false,
            err
        });
    }
}
exports.fundAccount = fundAccount;
async function withdrawFunds(req, res, next) {
    const transactionId = (0, uuid_1.v4)();
    const transactionType = 'outwards';
    try {
        const validationResult = utils_1.withdrawFundsSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message,
                success: false
            });
        }
        if (req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Please enter a valid amount",
                amount: req.body.amount,
                success: false
            });
        }
        const oldAccountBalanceObject = await database.select('account_balance').from('accounts').where('account_id', req.body.account_id).first();
        const oldAccountBalanceValue = Number(oldAccountBalanceObject?.account_balance.toFixed(2));
        const date = new Date();
        const duplicateTransaction = await database('transactions')
            .select('created_at')
            .where('from_account_id', req.body.account_id)
            .andWhere('amount', req.body.amount)
            .orderBy('created_at', 'desc')
            .first();
        if (duplicateTransaction) {
            const timeDifferenceInSeconds = getTimeDifferenceInSeconds(duplicateTransaction.created_at);
            if (timeDifferenceInSeconds <= minute) {
                return res.status(400).json({
                    err: "Duplicate transaction. Please try again soon",
                    success: false
                });
            }
        }
        if (oldAccountBalanceValue <= 0.0) {
            return res.status(400).json({
                err: "Insufficient funds in your account",
                amount: req.body.amount,
                account_balance: oldAccountBalanceValue,
                success: false
            });
        }
        if (oldAccountBalanceValue - req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Insufficient funds for this transaction",
                amount: req.body.amount,
                account_balance: oldAccountBalanceValue,
                success: false
            });
        }
        const newAccountBalance = Number((oldAccountBalanceValue - req.body.amount).toFixed(2));
        const record = await database('accounts').where({ account_id: req.body.account_id }).update({
            account_balance: newAccountBalance
        });
        res.status(200).json({
            message: "You have successfully withdrawn from your account",
            account_id: req.body.account_id,
            amount: req.body.amount,
            account_balance: newAccountBalance,
            success: true
        });
        await database('transactions').insert({
            transaction_id: transactionId,
            transaction_type: transactionType,
            from_account_id: req.body.account_id,
            to_account_id: req.body.account_id,
            date_issued: date.toLocaleString('en-GB'),
            amount: req.body.amount
        });
    }
    catch (err) {
        res.status(500).json({
            msg: 'Failed to withdraw from account',
            route: '/fund',
            err,
            success: false
        });
    }
}
exports.withdrawFunds = withdrawFunds;
async function transferFunds(req, res, next) {
    const transactionId = (0, uuid_1.v4)();
    const transactionType = 'transfer';
    try {
        const validationResult = utils_1.transferFundsSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message,
                success: false
            });
        }
        if (req.body.amount <= 0.0) {
            return res.status(400).json({
                err: "Please enter a valid amount",
                amount: req.body.amount,
                success: false
            });
        }
        if (req.body.from_account_id === req.body.to_account_id) {
            return res.status(400).json({
                err: "Sorry, you cannot transfer to yourself. Source and destination account are the same",
                account_id: req.body.to_account_id,
                success: false
            });
        }
        const sourceAccountBalanceObject = await database.select('account_balance', 'account_id').from('accounts').where('account_id', req.body.from_account_id).first();
        const sourceAccountBalanceValue = Number(sourceAccountBalanceObject?.account_balance.toFixed(2));
        const destinationAccountBalanceObject = await database.select('account_balance', 'account_id').from('accounts').where('account_id', req.body.to_account_id).first();
        const destinationAccountBalanceValue = Number(destinationAccountBalanceObject?.account_balance.toFixed(2));
        if (!sourceAccountBalanceObject?.account_id || !destinationAccountBalanceObject?.account_id) {
            return res.status(400).json({
                err: "Please enter valid account ids",
                from_account_id: req.body.from_account_id,
                to_account_id: req.body.to_account_id,
                success: false
            });
        }
        if (sourceAccountBalanceValue <= 0.0) {
            return res.status(400).json({
                err: "Insufficient funds in your account",
                amount: req.body.amount,
                account_balance: sourceAccountBalanceValue,
                success: false
            });
        }
        if (sourceAccountBalanceValue - req.body.amount < 0.0) {
            return res.status(400).json({
                err: "Insufficient funds for this transaction",
                amount: req.body.amount,
                account_balance: sourceAccountBalanceValue,
                success: false
            });
        }
        const sourceNewAccountBalance = sourceAccountBalanceValue - req.body.amount;
        const destinationNewAccountBalance = destinationAccountBalanceValue + req.body.amount;
        const sourceNewAccountBalanceFloat = Number(sourceNewAccountBalance.toFixed(2));
        const destinationNewAccountBalanceFloat = Number(destinationNewAccountBalance.toFixed(2));
        await database.transaction(async (trx) => {
            await database('accounts')
                .where({ account_id: req.body.from_account_id })
                .update({ account_balance: sourceNewAccountBalanceFloat })
                .transacting(trx);
            await database('accounts')
                .where({ account_id: req.body.to_account_id })
                .update({ account_balance: destinationNewAccountBalanceFloat })
                .transacting(trx);
        });
        const duplicateTransaction = await database('transactions')
            .select('created_at', 'from_account_id', 'amount')
            .where('amount', req.body.amount)
            .andWhere('from_account_id', req.body.from_account_id)
            .orderBy('created_at', 'desc')
            .first();
        if (duplicateTransaction) {
            const timeDifferenceInSeconds = getTimeDifferenceInSeconds(duplicateTransaction.created_at);
            if (timeDifferenceInSeconds <= minute) {
                return res.status(400).json({
                    err: "Duplicate transaction. Please try again soon",
                    success: false
                });
            }
        }
        const date = new Date();
        res.status(200).json({
            message: "You have successfully transferred",
            from_account_id: req.body.from_account_id,
            to_account_id: req.body.to_account_id,
            amount: req.body.amount,
            source_account_balance: sourceNewAccountBalanceFloat,
            destination_account_balance: destinationNewAccountBalanceFloat,
            success: true
        });
        await database('transactions').insert({
            transaction_id: transactionId,
            transaction_type: transactionType,
            from_account_id: req.body.from_account_id,
            to_account_id: req.body.to_account_id,
            date_issued: date.toLocaleString('en-GB'),
            amount: req.body.amount
        });
    }
    catch (err) {
        res.status(500).json({
            msg: 'Failed to transfer to account',
            route: '/transfer',
            err,
            success: false
        });
    }
}
exports.transferFunds = transferFunds;
function getTimeDifferenceInSeconds(transactionTime) {
    try {
        const lastTransactionTime = new Date(transactionTime);
        const newTransactionTime = new Date();
        const timeDifferenceInSeconds = (newTransactionTime.getTime() - lastTransactionTime.getTime()) / 1000;
        return timeDifferenceInSeconds;
    }
    catch (err) {
        throw err;
    }
}
