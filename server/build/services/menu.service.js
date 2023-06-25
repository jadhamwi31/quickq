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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const lodash_1 = require("lodash");
const models_1 = require("../models");
const category_model_1 = require("../models/category.model");
const error_model_1 = require("../models/error.model");
const menu_customization_model_1 = require("../models/menu_customization.model");
const dishes_service_1 = require("./dishes.service");
const redis_service_1 = __importDefault(require("./redis.service"));
const addMenuCustomization = (menu) => __awaiter(void 0, void 0, void 0, function* () {
    const menuCustomizationsRepository = models_1.AppDataSource.getRepository(menu_customization_model_1.MenuCustomization);
    const customizationWithSameNameExists = yield menuCustomizationsRepository.findOneBy({ name: menu.name });
    if (customizationWithSameNameExists) {
        throw new error_model_1.ConflictError("customization with same name exists");
    }
    const menuCustomization = new menu_customization_model_1.MenuCustomization();
    menuCustomization.active = false;
    menuCustomization.name = menu.name;
    menuCustomization.styles = JSON.stringify({
        body: menu.body,
        category: menu.category,
        item: menu.item,
    });
    yield menuCustomizationsRepository.save(menuCustomization);
    if (menu.categories_order) {
        const categoriesOrderRepository = models_1.AppDataSource.getRepository(category_model_1.CategoryOrder);
        const categoriesRepository = models_1.AppDataSource.getRepository(category_model_1.Category);
        const categoriesOrder = [];
        for (const [index, currentCategory] of menu.categories_order.entries()) {
            const category = yield categoriesRepository.findOneBy({
                name: currentCategory,
            });
            if (!category) {
                yield menuCustomizationsRepository.delete(menuCustomization);
                throw new error_model_1.NotFoundError(`category ${currentCategory} was not found`);
            }
            const categoryOrder = new category_model_1.CategoryOrder();
            categoryOrder.category = category;
            categoryOrder.order = index;
            categoryOrder.menuCustomization = menuCustomization;
            categoriesOrder.push(categoryOrder);
        }
        yield categoriesOrderRepository.save(categoriesOrder);
    }
});
const updateMenuCustomization = (name, menu) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const menuCustomizationsRepository = models_1.AppDataSource.getRepository(menu_customization_model_1.MenuCustomization);
    const menuCustomization = yield menuCustomizationsRepository.findOneBy({
        name,
    });
    if (!menuCustomization) {
        throw new error_model_1.NotFoundError(`customization ${name} not found`);
    }
    const prevActive = menuCustomization.active;
    if (menu.active)
        yield menuCustomizationsRepository
            .createQueryBuilder()
            .update(menu_customization_model_1.MenuCustomization)
            .where({ active: true })
            .set({ active: false })
            .execute();
    if (!(0, lodash_1.isUndefined)(menu.active))
        menuCustomization.active = menu.active;
    if (menu.name)
        menuCustomization.name = menu.name;
    menuCustomization.styles = JSON.stringify({
        body: (_a = menu.body) !== null && _a !== void 0 ? _a : JSON.parse(menuCustomization.styles).body,
        category: (_b = menu.category) !== null && _b !== void 0 ? _b : JSON.parse(menuCustomization.styles).category,
        item: (_c = menu.item) !== null && _c !== void 0 ? _c : JSON.parse(menuCustomization.styles).item,
    });
    yield menuCustomizationsRepository.save(menuCustomization);
    if (menu.categories_order) {
        const categoriesRepository = models_1.AppDataSource.getRepository(category_model_1.Category);
        const categoriesOrderRepository = models_1.AppDataSource.getRepository(category_model_1.CategoryOrder);
        const categoriesOrder = [];
        for (const [index, currentCategory] of menu.categories_order.entries()) {
            const category = yield categoriesRepository.findOneBy({
                name: currentCategory,
            });
            if (!category) {
                yield menuCustomizationsRepository.delete(menuCustomization);
                throw new error_model_1.NotFoundError(`category ${currentCategory} was not found`);
            }
            const categoryOrder = yield categoriesOrderRepository.findOne({
                where: { category, menuCustomization },
                relations: { category: true, menuCustomization: true },
            });
            if (categoryOrder) {
                categoryOrder.order = index;
                categoriesOrder.push(categoryOrder);
            }
            else {
                const newCategoryOrder = new category_model_1.CategoryOrder();
                newCategoryOrder.order = index;
                newCategoryOrder.menuCustomization = menuCustomization;
                newCategoryOrder.category = category;
                categoriesOrder.push(newCategoryOrder);
            }
        }
        yield categoriesOrderRepository.delete({ menuCustomization });
        yield categoriesOrderRepository.save(categoriesOrder);
    }
    if (prevActive && !(0, lodash_1.isUndefined)(menu.active) && !menu.active) {
        yield redis_service_1.default.redis.del("menu:customizations:active");
    }
    else if (menu.active) {
        const { body, item, category, } = JSON.parse(menuCustomization.styles);
        const redisMenuCustomization = {
            body,
            item,
            category,
            name: menuCustomization.name,
        };
        if (menuCustomization.categories_order) {
            redisMenuCustomization.categories_order =
                menuCustomization.categories_order.map((categoryOrder) => categoryOrder.category.name);
        }
        yield redis_service_1.default.redis.set("menu:customizations:active", JSON.stringify(redisMenuCustomization));
    }
});
const deleteMenuCustomization = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const menuCustomizationsRepository = models_1.AppDataSource.getRepository(menu_customization_model_1.MenuCustomization);
    const menuCustomizationRecord = yield menuCustomizationsRepository.findOneBy({
        name,
    });
    if (!menuCustomizationRecord) {
        throw new error_model_1.NotFoundError(`menu customization with name ${name} not found`);
    }
    if (menuCustomizationRecord.active) {
        yield redis_service_1.default.redis.del("menu:customizations:active");
    }
    yield menuCustomizationsRepository.delete(menuCustomizationRecord);
});
const getActiveMenu = () => __awaiter(void 0, void 0, void 0, function* () {
    const isActiveMenuCustomizationsCached = yield redis_service_1.default.isCached("menu:customizations:active");
    let activeMenuCustomization;
    if (isActiveMenuCustomizationsCached) {
        redis_service_1.default.cacheLog("menu:customizations:active");
        activeMenuCustomization = JSON.parse(yield redis_service_1.default.getCachedVersion("menu:customizations:active"));
    }
    else {
        const _activeMenuCustomization = yield models_1.AppDataSource.getRepository(menu_customization_model_1.MenuCustomization)
            .createQueryBuilder("menu_customization")
            .leftJoinAndSelect("menu_customization.categories_order", "category_order")
            .where("menu_customization.active = :active", { active: true })
            .leftJoinAndSelect("category_order.category", "category")
            .orderBy("category_order.order", "ASC")
            .select()
            .getOne();
        if (_activeMenuCustomization) {
            const { body, item, category, } = JSON.parse(_activeMenuCustomization.styles);
            activeMenuCustomization = {
                body,
                item,
                category,
                name: _activeMenuCustomization.name,
            };
            if (_activeMenuCustomization.categories_order) {
                activeMenuCustomization.categories_order =
                    _activeMenuCustomization.categories_order.map((categoryOrder) => categoryOrder.category.name);
            }
            yield redis_service_1.default.redis.set("menu:customizations:active", JSON.stringify(activeMenuCustomization));
        }
        else {
            activeMenuCustomization = null;
        }
    }
    const dishes = yield dishes_service_1.DishesService.getDishes();
    const categories = {};
    dishes.forEach((dish) => {
        const dishCategory = dish.category;
        delete dish.category;
        if (categories[dishCategory]) {
            categories[dishCategory].push(dish);
        }
        else {
            categories[dishCategory] = [];
            categories[dishCategory].push(dish);
        }
    });
    return { categories, menu: activeMenuCustomization };
});
const getMenuCustomizations = () => __awaiter(void 0, void 0, void 0, function* () {
    const menuCustomizations = yield models_1.AppDataSource.getRepository(menu_customization_model_1.MenuCustomization)
        .createQueryBuilder("menu_customization")
        .leftJoinAndSelect("menu_customization.categories_order", "category_order")
        .leftJoinAndSelect("category_order.category", "category")
        .orderBy("category_order.order", "ASC")
        .select()
        .getMany();
    return menuCustomizations.map((customization) => (Object.assign(Object.assign({}, customization), { styles: JSON.parse(customization.styles) })));
});
exports.MenuService = {
    addMenuCustomization,
    getActiveMenu,
    deleteMenuCustomization,
    updateMenuCustomization,
    getMenuCustomizations,
};
