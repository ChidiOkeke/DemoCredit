"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controller/user.controller");
router.post('/register', user_controller_1.registerUser);
router.post('/login', user_controller_1.loginUser);
exports.default = router;
