"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const transaction_controller_1 = require("../controller/transaction.controller");
const router = express_1.default.Router();
router.get('/', auth_1.auth, transaction_controller_1.getAllTransactions);
router.get('/:account_id', auth_1.auth, transaction_controller_1.getAccountTransactions);
exports.default = router;
