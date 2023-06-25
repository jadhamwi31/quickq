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
exports.BrandController = void 0;
const brand_service_1 = require("../services/brand.service");
const http_status_codes_1 = require("http-status-codes");
const setBrandHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const brand = req.body;
    try {
        yield brand_service_1.BrandService.setBrand(brand);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "brand updated" });
    }
    catch (e) {
        next(e);
    }
});
const getBrandHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = yield brand_service_1.BrandService.getBrand();
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, data: { brand } });
    }
    catch (e) {
        next(e);
    }
});
exports.BrandController = {
    setBrandHandler,
    getBrandHandler,
};
