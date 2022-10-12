"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountTransactions = exports.getAllTransactions = void 0;
const knex_1 = __importDefault(require("knex"));
const knexConfig = require('../../knexfile.js');
const database = (0, knex_1.default)(knexConfig.development);
async function getAllTransactions(req, res, next) {
    try {
        const transactions = await database('transactions').select('*');
        if (transactions.length > 0) {
            return res.status(200).json({
                count: transactions.length,
                success: true,
                transactions
            });
        }
        else {
            return res.status(400).json({
                message: 'No transactions found',
                success: false
            });
        }
    }
    catch (err) {
        res.status(500).json({
            msg: 'Failed to fetch all transactions',
            route: '/',
            err,
            success: false
        });
    }
}
exports.getAllTransactions = getAllTransactions;
async function getAccountTransactions(req, res, next) {
    try {
        const transactions = await database('transactions')
            .select('*')
            .where('from_account_id', req.params.account_id)
            .orWhere('to_account_id', req.params.account_id);
        if (transactions.length > 0) {
            return res.status(200).json({
                count: transactions.length,
                success: true,
                transactions
            });
        }
        else {
            return res.status(400).json({
                message: 'No transactions found',
                success: false
            });
        }
    }
    catch (err) {
        res.status(500).json({
            msg: 'Failed to fetch account transactions',
            route: '/',
            err,
            success: false
        });
    }
}
exports.getAccountTransactions = getAccountTransactions;
