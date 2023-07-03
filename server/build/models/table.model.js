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
exports.TableSession = exports.TableCode = exports.Table = void 0;
const typeorm_1 = require("typeorm");
const order_model_1 = require("./order.model");
const payment_model_1 = require("./payment.model");
let Table = class Table {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Table.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Table.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_model_1.Payment, (payment) => payment.table),
    __metadata("design:type", Array)
], Table.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_model_1.Order, (order) => order.table),
    __metadata("design:type", Array)
], Table.prototype, "orders", void 0);
Table = __decorate([
    (0, typeorm_1.Entity)()
], Table);
exports.Table = Table;
let TableCode = class TableCode {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TableCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TableCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Table, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Table)
], TableCode.prototype, "table", void 0);
TableCode = __decorate([
    (0, typeorm_1.Entity)()
], TableCode);
exports.TableCode = TableCode;
let TableSession = class TableSession {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TableSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Table, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Table)
], TableSession.prototype, "table", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TableSession.prototype, "clientId", void 0);
TableSession = __decorate([
    (0, typeorm_1.Entity)()
], TableSession);
exports.TableSession = TableSession;
