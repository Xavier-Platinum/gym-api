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
exports.AddonSchema = exports.Addon = exports.SubscriptionSchema = exports.Subscription = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Subscription = class Subscription extends mongoose_2.Document {
};
exports.Subscription = Subscription;
__decorate([
    (0, mongoose_1.Prop)({ type: { publicId: { type: String }, imageValue: { type: String } } }),
    __metadata("design:type", Object)
], Subscription.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Subscription.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Subscription.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Subscription.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Subscription.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Subscription.prototype, "durationInMonths", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: false }),
    __metadata("design:type", Object)
], Subscription.prototype, "renewalSettings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: [] }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isRecurring", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Subscription.prototype, "services", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isArchived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Subscription.prototype, "updatedAt", void 0);
exports.Subscription = Subscription = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toObject: { getters: true, virtuals: true, versionKey: false },
        toJSON: { getters: true, virtuals: true, versionKey: false },
    })
], Subscription);
exports.SubscriptionSchema = mongoose_1.SchemaFactory.createForClass(Subscription);
let Addon = class Addon extends mongoose_2.Document {
};
exports.Addon = Addon;
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            publicId: { type: String, default: '' },
            imageValue: { type: String, default: '' },
        },
    }),
    __metadata("design:type", Object)
], Addon.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Addon.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Addon.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], Addon.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], Addon.prototype, "isArchived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Addon.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], Addon.prototype, "updatedAt", void 0);
exports.Addon = Addon = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        toObject: { getters: true, virtuals: true, versionKey: false },
        toJSON: { getters: true, virtuals: true, versionKey: false },
    })
], Addon);
exports.AddonSchema = mongoose_1.SchemaFactory.createForClass(Addon);
