var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Serializer } from "./serializer";
import { unserialize } from "./index";
export var ArraySerializer = (function (_super) {
    __extends(ArraySerializer, _super);
    function ArraySerializer(valueType) {
        _super.call(this);
        this.valueType = valueType;
    }
    ArraySerializer.prototype.serialize = function (value, options) {
        if (this.isUndefinedOrNull(value)) {
            return this.serializeUndefinedOrNull(value, options);
        }
        else if (Array.isArray(value)) {
            return value;
        }
        else if (!options || !options.ignoreErrors) {
            throw 'Cannot serialize "' + value + " as array";
        }
        else {
            return undefined;
        }
    };
    ArraySerializer.prototype.unserialize = function (value, options) {
        if (Array.isArray(value)) {
            if (this.valueType) {
                var array = [];
                if (this.valueType instanceof Serializer) {
                    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                        var i = value_1[_i];
                        array.push(this.valueType.unserialize(i));
                    }
                }
                else {
                    for (var _a = 0, value_2 = value; _a < value_2.length; _a++) {
                        var i = value_2[_a];
                        array.push(unserialize(i, this.valueType));
                    }
                }
                return array;
            }
            else {
                return value;
            }
        }
        else if (this.isUndefinedOrNull(value)) {
            return this.unserializeUndefinedOrNull(value, options);
        }
        else if (!options || !options.ignoreErrors) {
            throw 'Cannot unserialize "' + value + " to array.";
        }
        else {
            return undefined;
        }
    };
    return ArraySerializer;
}(Serializer));
export var ArrayOfAny = new ArraySerializer();
export var ArrayOfString = new ArraySerializer(String);
export var ArrayOfNumber = new ArraySerializer(Number);
//# sourceMappingURL=array-serializer.js.map