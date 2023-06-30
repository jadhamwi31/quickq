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
exports.BrandService = void 0;
const models_1 = require("../models");
const brand_model_1 = require("../models/brand.model");
const upload_service_1 = require("./upload.service");
const setBrand = (brand) => __awaiter(void 0, void 0, void 0, function* () {
    const brandRepository = models_1.AppDataSource.getRepository(brand_model_1.Brand);
    const isNew = !(yield brandRepository.findOneBy({}));
    const brandRecord = !isNew ? (yield brandRepository.findOneBy({})) : new brand_model_1.Brand();
    const oldName = brandRecord.name;
    brandRecord.name = brand.name;
    if (brand.slogan)
        brandRecord.slogan = brand.slogan;
    if (brand.logo !== undefined) {
        if (brandRecord.logo)
            (0, upload_service_1.deleteImage)(brandRecord.logo);
        brandRecord.logo = brand.logo;
    }
    if (isNew) {
        yield brandRepository.save(brandRecord);
    }
    else {
        yield brandRepository.update({ name: oldName }, brandRecord);
    }
});
const getBrand = () => __awaiter(void 0, void 0, void 0, function* () {
    const brandRepository = models_1.AppDataSource.getRepository(brand_model_1.Brand);
    const brandRecord = yield brandRepository.findOneBy({});
    return brandRecord;
});
exports.BrandService = {
    setBrand,
    getBrand,
};
