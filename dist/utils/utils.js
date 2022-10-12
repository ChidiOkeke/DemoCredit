"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.generateToken = exports.loginSchema = exports.registerSchema = exports.transferFundsSchema = exports.withdrawFundsSchema = exports.fundAccountSchema = exports.createAccountSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createAccountSchema = joi_1.default.object().keys({
    user_id: joi_1.default.string().required(),
    account_status: joi_1.default.string().required()
});
exports.fundAccountSchema = joi_1.default.object().keys({
    account_id: joi_1.default.string().required(),
    amount: joi_1.default.number().required()
});
exports.withdrawFundsSchema = joi_1.default.object().keys({
    account_id: joi_1.default.string().required(),
    amount: joi_1.default.number().required()
});
exports.transferFundsSchema = joi_1.default.object().keys({
    from_account_id: joi_1.default.string().required(),
    to_account_id: joi_1.default.string().required(),
    amount: joi_1.default.number().required()
});
exports.registerSchema = joi_1.default.object().keys({
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().required(),
    date_of_birth: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    phone_number: joi_1.default.string().length(11).pattern(/^[0-9]+$/).required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirm_password: joi_1.default.ref("password")
}).with('password', 'confirm_password');
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/),
});
//Generate Token
const generateToken = (user) => {
    try {
        const pass = process.env.JWT_SECRET;
        return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '1d' });
    }
    catch (err) {
        throw err;
    }
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
