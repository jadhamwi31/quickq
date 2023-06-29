"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUndefinedProperties = exports.blobStringToBlobObject = void 0;
const lodash_1 = require("lodash");
const blobStringToBlobObject = (blobString) => {
    const blobData = Buffer.from(blobString.split(",")[1], "base64");
    return new Blob([blobData], { type: "image/png" });
};
exports.blobStringToBlobObject = blobStringToBlobObject;
const removeUndefinedProperties = (obj) => {
    return (0, lodash_1.pickBy)(obj, value => value !== undefined);
};
exports.removeUndefinedProperties = removeUndefinedProperties;
