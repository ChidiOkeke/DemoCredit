"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const knex_1 = __importDefault(require("knex"));
const knexConfig = require('../../knexfile.js');
const database = (0, knex_1.default)(knexConfig.development);
async function registerUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message,
                success: false
            });
        }
        const duplicatEmail = await database('users').select('email').where('email', req.body.email).first();
        if (duplicatEmail) {
            return res.status(409).json({
                message: "Email is already in use. Please change email",
                success: false
            });
        }
        const duplicatePhone = await database('users').select('phone_number').where('phone_number', req.body.phone_number).first();
        if (duplicatePhone) {
            return res.status(409).json({
                message: "Phone number is already in use. Please change phone number",
                success: false
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await database('users').insert({
            user_id: id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            date_of_birth: req.body.date_of_birth,
            phone_number: req.body.phone_number,
            password: passwordHash
        });
        res.status(201).json({
            message: "You have successfully created a user",
            success: true,
            user_id: id
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Failed to register user',
            success: false,
            route: '/register',
            err
        });
    }
}
exports.registerUser = registerUser;
async function loginUser(req, res, next) {
    try {
        const validationResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                err: validationResult.error.details[0].message,
                success: false
            });
        }
        console.log('1');
        const user = await database.select('*').from('users').where('email', req.body.email).first();
        console.log('2');
        if (user) {
            console.log('3');
            const { user_id } = user;
            console.log('4');
            const token = (0, utils_1.generateToken)({ user_id });
            console.log('4.1');
            const validUser = await bcryptjs_1.default.compare(req.body.password, user.password);
            console.log('5');
            delete user.password; //delete password from user object before api response
            console.log('6');
            if (!validUser) {
                res.status(401).json({
                    message: "Passwords do not match",
                    success: false
                });
            }
            console.log('7');
            if (validUser) {
                res.status(200).json({
                    message: "Successfully logged in",
                    success: true,
                    token,
                    user
                });
            }
        }
        else {
            res.status(400).json({
                message: 'User does not exist',
                route: '/login',
                success: false
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'failed to login',
            route: '/login',
            err,
            success: false
        });
    }
}
exports.loginUser = loginUser;
