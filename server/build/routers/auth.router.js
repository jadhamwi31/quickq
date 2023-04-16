"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validators_1 = require("../validators/auth.validators");
exports.AuthRouter = (0, express_1.Router)();
exports.AuthRouter.post("/login", auth_validators_1.AuthValidators.validateLogin, auth_controller_1.UserController.loginHandler);
