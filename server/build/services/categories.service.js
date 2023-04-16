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
exports.CategoriesService = void 0;
const models_1 = require("../models");
const category_model_1 = require("../models/category.model");
const error_model_1 = require("../models/error.model");
const createNewCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesRepo = models_1.AppDataSource.getRepository(category_model_1.Category);
    const categoryExists = yield categoriesRepo.findOneBy({ name });
    if (categoryExists) {
        throw new error_model_1.ConflictError(`category ${name} exists`);
    }
    const category = new category_model_1.Category();
    category.name = name;
    yield categoriesRepo.insert(category);
});
const deleteCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesRepo = models_1.AppDataSource.getRepository(category_model_1.Category);
    const categoryExists = yield categoriesRepo.findOneBy({ name });
    if (!categoryExists) {
        throw new error_model_1.NotFoundError(`category to delete : not found`);
    }
    yield categoriesRepo.delete({ name });
});
const updateCategory = (prevName, newName) => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesRepo = models_1.AppDataSource.getRepository(category_model_1.Category);
    const categoryRecord = yield categoriesRepo.findOneBy({ name: prevName });
    if (!categoryRecord) {
        throw new error_model_1.NotFoundError(`category to update : not found`);
    }
    categoryRecord.name = newName;
    yield categoriesRepo.save(categoryRecord);
});
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesRepo = models_1.AppDataSource.getRepository(category_model_1.Category);
    return (yield categoriesRepo.find()).map((category) => category.name);
});
exports.CategoriesService = {
    createNewCategory,
    deleteCategory,
    updateCategory,
    getCategories,
};
