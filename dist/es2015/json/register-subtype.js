"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("./decorators");
function registerSubtype(clazz, matcherOrProperty, value, type) {
    decorators_1.setupSerialization(clazz.prototype);
    let types;
    if (clazz.hasOwnProperty("__json__subtypes")) {
        types = Object.getOwnPropertyDescriptor(clazz, "__json__subtypes").value;
    }
    else {
        types = [];
        Object.defineProperty(clazz, "__json__subtypes", { value: types, enumerable: false, configurable: false });
    }
    types.push({
        property: typeof matcherOrProperty === "string" ? matcherOrProperty : undefined,
        value: value,
        type: type,
        matcher: typeof matcherOrProperty === "function" ? matcherOrProperty : undefined
    });
}
exports.registerSubtype = registerSubtype;
//# sourceMappingURL=register-subtype.js.map