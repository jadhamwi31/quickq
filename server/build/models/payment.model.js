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
exports.Payment = void 0;
const typeorm_1 = require("typeorm");
const order_model_1 = require("./order.model");
const table_model_1 = require("./table.model");
let Payment = class Payment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Payment.prototype, "clientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_model_1.Order, (order) => order.payment),
    __metadata("design:type", Array)
], Payment.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => table_model_1.Table, (table) => table.payments, { onDelete: "CASCADE" }),
    __metadata("design:type", table_model_1.Table)
], Payment.prototype, "table", void 0);
Payment = __decorate([
    (0, typeorm_1.Entity)()
], Payment);
exports.Payment = Payment;
