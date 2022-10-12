"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const knex_1 = __importDefault(require("knex"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const knexConfig = require('../../knexfile.js');
const database = (0, knex_1.default)(knexConfig.development);
async function auth(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({
                error: 'Kindly sign in as a user'
            });
        }
        const token = authorization?.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res.status(401).json({
                error: 'User not verified, you cant access this route'
            });
        }
        const { user_id } = verified;
        const user = await database.select('*').from('users').where('user_id', user_id).first();
        if (!user) {
            return res.status(404).json({
                error: 'User not verified'
            });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(403).json({
            error: 'User not logged in'
        });
    }
}
exports.auth = auth;
