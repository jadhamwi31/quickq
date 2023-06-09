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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const shared_model_1 = require("./shared.model");
const table_model_1 = require("./table.model");
const payment_model_1 = require("./payment.model");
let Order = class Order {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => table_model_1.Table, (table) => table.orders, { onDelete: "CASCADE" }),
    __metadata("design:type", table_model_1.Table)
], Order.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shared_model_1.OrderDish, (orderDish) => orderDish.order),
    __metadata("design:type", Array)
], Order.prototype, "orderDishes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_model_1.Payment, (payment) => payment.orders, {
        onDelete: "SET NULL",
    }),
    __metadata("design:type", payment_model_1.Payment)
], Order.prototype, "payment", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)()
], Order);
exports.Order = Order;
