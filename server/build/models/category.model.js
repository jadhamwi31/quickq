"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryOrder = exports.Category = void 0;
const typeorm_1 = require("typeorm");
const dish_model_1 = require("./dish.model");
const menu_customization_model_1 = require("./menu_customization.model");
let Category = class Category {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => dish_model_1.Dish, (dish) => dish.category),
    __metadata("design:type", Array)
], Category.prototype, "dishes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CategoryOrder, (categoryOrder) => categoryOrder.category),
    __metadata("design:type", Array)
], Category.prototype, "categories_order", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "image", void 0);
Category = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["name"])
], Category);
exports.Category = Category;
let CategoryOrder = class CategoryOrder {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CategoryOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_customization_model_1.MenuCustomization, (menuCustomization) => menuCustomization.categories_order, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", menu_customization_model_1.MenuCustomization)
], CategoryOrder.prototype, "menuCustomization", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CategoryOrder.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category, (category) => category.categories_order, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Category)
], CategoryOrder.prototype, "category", void 0);
CategoryOrder = __decorate([
    (0, typeorm_1.Entity)()
], CategoryOrder);
exports.CategoryOrder = CategoryOrder;
