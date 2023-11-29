"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    mobile: { type: String, required: true },
    zipCode: { type: String, required: true },
    profilePic: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        coordinates: {
            type: { type: String, default: 'Point' },
            coordinates: [Number],
        }
    }
}, {
    timestamps: true,
});
// userSchema.index({ "address.coordinates": "2dsphere" });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
