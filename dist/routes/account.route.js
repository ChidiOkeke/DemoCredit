"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const account_controller_1 = require("../controller/account.controller");
const router = express_1.default.Router();
router.post('/create', auth_1.auth, account_controller_1.createAccount);
router.put('/fund', auth_1.auth, account_controller_1.fundAccount);
router.put('/withdraw', auth_1.auth, account_controller_1.withdrawFunds);
router.put('/transfer', auth_1.auth, account_controller_1.transferFunds);
exports.default = router;
