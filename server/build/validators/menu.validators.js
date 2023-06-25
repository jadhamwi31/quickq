"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuValidators = void 0;
const zod_1 = __importDefault(require("zod"));
const error_model_1 = require("../models/error.model");
const createMenuCustomizationSchema = (type) => {
    const MenuCategoriesOrderSchema = zod_1.default.array(zod_1.default.string()).optional();
    if (type === "optional") {
        const CSSPropertiesSchema = zod_1.default.record(zod_1.default.any(), zod_1.default.any()).optional();
        return zod_1.default.object({
            name: zod_1.default.string().optional(),
            body: CSSPropertiesSchema,
            item: CSSPropertiesSchema,
            category: CSSPropertiesSchema,
            categories_order: MenuCategoriesOrderSchema,
            status: zod_1.default.union([zod_1.default.literal("active"), zod_1.default.literal("in-active")]).optional(),
        });
    }
    else {
        const CSSPropertiesSchema = zod_1.default.record(zod_1.default.any(), zod_1.default.any());
        return zod_1.default.object({
            name: zod_1.default.string(),
            body: CSSPropertiesSchema,
            item: CSSPropertiesSchema,
            category: CSSPropertiesSchema,
            categories_order: MenuCategoriesOrderSchema,
        });
    }
};
const validateAddMenuCustomization = (req, res, next) => {
    const menu = req.body;
    try {
        createMenuCustomizationSchema("required").parse(menu);
        return next();
    }
    catch (e) {
        console.log(e);
        return next(new error_model_1.BadRequestError("re-check menu properties"));
    }
};
const validateUpdateMenuCustomization = (req, res, next) => {
    const menu = req.body;
    try {
        const { name } = req.params;
        createMenuCustomizationSchema("optional").parse(menu);
        if (!name) {
            return next(new error_model_1.BadRequestError("style name is required"));
        }
        return next();
    }
    catch (e) {
        console.log(e);
        return next(new error_model_1.BadRequestError("re-check menu properties"));
    }
};
const validateDeleteMenuCustomization = (req, res, next) => {
    try {
        const { name } = req.params;
        if (!name) {
            return next(new error_model_1.BadRequestError("style name is required"));
        }
        return next();
    }
    catch (e) {
        return next(new error_model_1.BadRequestError("re-check menu properties"));
    }
};
exports.MenuValidators = {
    validateAddMenuCustomization,
    validateUpdateMenuCustomization,
    validateDeleteMenuCustomization,
};
