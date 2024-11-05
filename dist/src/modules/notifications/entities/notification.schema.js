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
exports.NotificationSchema = exports.Notification = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Notification = class Notification extends mongoose_2.Document {
};
exports.Notification = Notification;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Notification.prototype, "resourceUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Notification.prototype, "body", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['general', 'individual', 'in_app'],
        default: 'individual',
    }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['promotion', 'alert', 'reminder'],
        default: 'promotion',
    }),
    __metadata("design:type", String)
], Notification.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['low', 'medium', 'high'],
        default: 'low',
    }),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['unread', 'read'],
        default: 'unread',
    }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['pending', 'failed', 'delivered'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Notification.prototype, "deliveryStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Notification.prototype, "retryCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], Notification.prototype, "scheduledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isArchived", void 0);
exports.Notification = Notification = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toObject: { getters: true, virtuals: true, versionKey: false },
        toJSON: { getters: true, virtuals: true, versionKey: false },
    })
], Notification);
exports.NotificationSchema = mongoose_1.SchemaFactory.createForClass(Notification);
