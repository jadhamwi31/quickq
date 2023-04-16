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
exports.CategoriesController = void 0;
const categories_service_1 = require("../services/categories.service");
const http_status_codes_1 = require("http-status-codes");
const createNewCategoryHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        yield categories_service_1.CategoriesService.createNewCategory(name);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "category created" });
    }
    catch (e) {
        next(e);
    }
});
const deleteCategoryHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        yield categories_service_1.CategoriesService.deleteCategory(name);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "category deleted" });
    }
    catch (e) {
        next(e);
    }
});
const updateCategoryHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const categoryName = req.params.name;
    try {
        yield categories_service_1.CategoriesService.updateCategory(categoryName, name);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "category updated" });
    }
    catch (e) {
        next(e);
    }
});
const getCategoriesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categories_service_1.CategoriesService.getCategories();
        return res.status(http_status_codes_1.StatusCodes.OK).send(categories);
    }
    catch (e) {
        next(e);
    }
});
exports.CategoriesController = {
    createNewCategoryHandler,
    deleteCategoryHandler,
    updateCategoryHandler,
    getCategoriesHandler,
};
