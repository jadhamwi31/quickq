"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddlewares = void 0;
const express_1 = require("express");
const upload_service_1 = require("../services/upload.service");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const error_model_1 = require("../models/error.model");
const parse_middleware_1 = require("./parse.middleware");
const uploadMiddlewares = (imageKey) => [
    upload_service_1.upload.single(imageKey),
    (0, express_1.urlencoded)({ extended: true }),
    parse_middleware_1.parseRemainingFields,
    (req, res, next) => {
        console.log(req.body);
        if (req.file) {
            const id = (0, uuid_1.v4)();
            try {
                fs_1.default.renameSync(req.file.path, path_1.default.resolve(upload_service_1.imagesDirectory, `${id}.png`));
                req.body = Object.assign(Object.assign({}, req.body), { [imageKey]: `${id}.png` });
            }
            catch (e) {
                throw new error_model_1.InternalServerError("server error");
            }
        }
        else {
            req.body[imageKey] = undefined;
        }
        return next();
    },
];
exports.uploadMiddlewares = uploadMiddlewares;
