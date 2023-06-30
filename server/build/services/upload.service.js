"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.upload = exports.imagesDirectory = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.imagesDirectory = path_1.default.join(__dirname, "../../images/");
exports.upload = (0, multer_1.default)({ dest: exports.imagesDirectory });
const deleteImage = (imageName) => {
    try {
        fs_1.default.unlinkSync(path_1.default.join(exports.imagesDirectory, imageName));
    }
    catch (e) {
        console.log(e);
    }
};
exports.deleteImage = deleteImage;
