import * as tslib_1 from "tslib";
import { PreferenceItemRefImpl } from "./item-impl";
var PreferencesCollectionRefImpl = /** @class */ (function () {
    function PreferencesCollectionRefImpl(container, name) {
        this.container = container;
        this.name = name;
    }
    PreferencesCollectionRefImpl.prototype.items = function () {
        var _this = this;
        var keysOrFilter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keysOrFilter[_i] = arguments[_i];
        }
        if (arguments.length === 0 || typeof arguments[0] === "function") {
            var filter_1 = arguments.length > 0 && arguments[0];
            return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var preferences, _i, _a, pref, error_1;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            preferences = [];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, , 7]);
                            _i = 0;
                            return [4 /*yield*/, this.container.items(this.name, filter_1)];
                        case 2:
                            _a = _b.sent();
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            pref = _a[_i];
                            preferences.push(new PreferenceItemRefImpl(this, pref.key));
                            _b.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 3];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_1 = _b.sent();
                            return [2 /*return*/, reject(error_1)];
                        case 7: return [2 /*return*/, resolve(preferences)];
                    }
                });
            }); });
        }
        else if (Array.isArray(arguments[0])) {
            var items = [];
            for (var _a = 0, _b = arguments[0]; _a < _b.length; _a++) {
                var key = _b[_a];
                items.push(new PreferenceItemRefImpl(this, key));
            }
            return items;
        }
        else {
            throw new Error("Invalid arguments");
        }
    };
    PreferencesCollectionRefImpl.prototype.delete = function () {
        return this.container.delete(this.name, arguments[0]);
    };
    PreferencesCollectionRefImpl.prototype.exists = function (key) {
        return this.container.exists(this.name, key);
    };
    PreferencesCollectionRefImpl.prototype.item = function (key) {
        return new PreferenceItemRefImpl(this, key);
    };
    PreferencesCollectionRefImpl.prototype.set = function (key, value, options) {
        return this.container.set(this.name, key, value, options);
    };
    PreferencesCollectionRefImpl.prototype.update = function (key, value) {
        return this.container.update(this.name, key, value);
    };
    PreferencesCollectionRefImpl.prototype.value = function (key) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.container.get(this.name, key)];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, (item && item.value) || null];
                }
            });
        });
    };
    PreferencesCollectionRefImpl.prototype.values = function () {
        var _this = this;
        var keysOrFilter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keysOrFilter[_i] = arguments[_i];
        }
        var filter = arguments.length > 0 && typeof arguments[0] === "function" && arguments[0];
        var keys = arguments.length > 0 && Array.isArray(arguments[0]) && arguments[0];
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var values, _i, _a, item, error_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        values = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _i = 0;
                        return [4 /*yield*/, this.container.items(this.name, keys || filter || null)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        item = _a[_i];
                        values.push(item.value);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 3];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _b.sent();
                        return [2 /*return*/, reject(error_2)];
                    case 7: return [2 /*return*/, resolve(values)];
                }
            });
        }); });
    };
    return PreferencesCollectionRefImpl;
}());
export { PreferencesCollectionRefImpl };
//# sourceMappingURL=collection-impl.js.map