"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRemainingFields = void 0;
const parseRemainingFields = (req, res, next) => {
    req.body = Object.fromEntries(Object.entries(req.body).map(([key, value]) => {
        try {
            const parsedObject = JSON.parse(value);
            return [key, parsedObject];
        }
        catch (e) {
            return [key, value];
        }
    }));
    next();
};
exports.parseRemainingFields = parseRemainingFields;
