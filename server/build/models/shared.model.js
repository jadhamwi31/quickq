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
exports.OrderDish = exports.DishIngredient = void 0;
const typeorm_1 = require("typeorm");
const dish_model_1 = require("./dish.model");
const ingredient_model_1 = require("./ingredient.model");
const order_model_1 = require("./order.model");
let DishIngredient = class DishIngredient {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DishIngredient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dish_model_1.Dish, (dish) => dish.dishIngredients, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", dish_model_1.Dish)
], DishIngredient.prototype, "dish", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ingredient_model_1.Ingredient, (ingredient) => ingredient.dishIngredients, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", ingredient_model_1.Ingredient)
], DishIngredient.prototype, "ingredient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "real" }),
    __metadata("design:type", Number)
], DishIngredient.prototype, "amount", void 0);
DishIngredient = __decorate([
    (0, typeorm_1.Entity)()
], DishIngredient);
exports.DishIngredient = DishIngredient;
let OrderDish = class OrderDish {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderDish.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_model_1.Order, (order) => order.orderDishes, { onDelete: "CASCADE" }),
    __metadata("design:type", order_model_1.Order)
], OrderDish.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dish_model_1.Dish, (dish) => dish.orderDishes, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", dish_model_1.Dish)
], OrderDish.prototype, "dish", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrderDish.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderDish.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 20 }),
    __metadata("design:type", Number)
], OrderDish.prototype, "price", void 0);
OrderDish = __decorate([
    (0, typeorm_1.Entity)()
], OrderDish);
exports.OrderDish = OrderDish;
