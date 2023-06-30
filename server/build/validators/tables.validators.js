"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesValidators = void 0;
const error_model_1 = require("../models/error.model");
const validateNewTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return next(new error_model_1.BadRequestError("id is required"));
    }
    return next();
});
const validateUpdateTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
        return next(new error_model_1.BadRequestError("id parameter is required"));
    }
    if (!status) {
        return next(new error_model_1.BadRequestError("key : [status] is required"));
    }
    if (!(status === "Available" || status == "Busy")) {
        return next(new error_model_1.BadRequestError("invalid table status"));
    }
    return next();
});
const validateDeleteTable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new error_model_1.BadRequestError("id parameter is required"));
    }
    return next();
});
exports.TablesValidators = {
    validateNewTable,
    validateUpdateTable,
    validateDeleteTable,
};
