"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const error_model_1 = require("../models/error.model");
const errorMiddleware = (err, req, res, next) => {
    console.log(err.stack);
    if (err instanceof error_model_1.CustomError) {
        return res
            .status(err.status)
            .send({ code: err.status, message: err.message, name: err.name });
    }
    else {
        return res.status(500).send(err.message);
    }
};
exports.errorMiddleware = errorMiddleware;
