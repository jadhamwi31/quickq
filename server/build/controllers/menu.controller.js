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
exports.MenuController = void 0;
const menu_service_1 = require("../services/menu.service");
const http_status_codes_1 = require("http-status-codes");
const addMenuCustomizationHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield menu_service_1.MenuService.addMenuCustomization(req.body);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "menu customization created" });
    }
    catch (e) {
        next(e);
    }
});
const updateMenuCustomizationHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        yield menu_service_1.MenuService.updateMenuCustomization(name, req.body);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "menu customization updated" });
    }
    catch (e) {
        next(e);
    }
});
const deleteMenuCustomizationHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        yield menu_service_1.MenuService.deleteMenuCustomization(name);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .send({ code: http_status_codes_1.StatusCodes.OK, message: "menu customization deleted" });
    }
    catch (e) {
        next(e);
    }
});
const getMenuHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { menu, categories } = yield menu_service_1.MenuService.getActiveMenu();
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            data: {
                menu,
                categories,
            },
        });
    }
    catch (e) {
        next(e);
    }
});
const getAllMenuCustomizationsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customizations = yield menu_service_1.MenuService.getMenuCustomizations();
        return res.status(http_status_codes_1.StatusCodes.OK).send({
            code: http_status_codes_1.StatusCodes.OK,
            data: customizations,
        });
    }
    catch (e) {
        next(e);
    }
});
exports.MenuController = {
    addMenuCustomizationHandler,
    getMenuHandler,
    updateMenuCustomizationHandler,
    deleteMenuCustomizationHandler,
    getAllMenuCustomizationsHandler,
};
