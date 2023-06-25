"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blobStringToBlobObject = void 0;
const blobStringToBlobObject = (blobString) => {
    const blobData = Buffer.from(blobString.split(",")[1], "base64");
    return new Blob([blobData], { type: "image/png" });
};
exports.blobStringToBlobObject = blobStringToBlobObject;
