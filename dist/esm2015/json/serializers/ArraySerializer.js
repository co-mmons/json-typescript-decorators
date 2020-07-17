import { resolveForwardRef } from "../../core";
import { findTypeSerializer } from "../findTypeSerializer";
import { Serializer } from "../Serializer";
import { ObjectSerializer } from "./ObjectSerializer";
export class ArraySerializer extends Serializer {
    constructor(valueTypeOrSerializer) {
        super();
        if (arguments.length == 1 && !valueTypeOrSerializer) {
            throw new Error("Value type passed to Json Array Serializer is undefined - check, whether class reference cycle");
        }
        if (valueTypeOrSerializer) {
            this.typeOrSerializer = resolveForwardRef(valueTypeOrSerializer);
        }
    }
    serialize(value, options) {
        if (this.isUndefinedOrNull(value)) {
            return this.serializeUndefinedOrNull(value, options);
        }
        else if (Array.isArray(value)) {
            const array = [];
            if (this.typeOrSerializer instanceof Serializer) {
                for (const i of value) {
                    array.push(this.typeOrSerializer.serialize(i, options));
                }
            }
            else {
                let serializer = this.typeOrSerializer && findTypeSerializer(this.typeOrSerializer, options === null || options === void 0 ? void 0 : options.typeProviders);
                if (!serializer) {
                    serializer = this.typeOrSerializer ? new ObjectSerializer(this.typeOrSerializer) : ObjectSerializer.instance;
                }
                for (const i of value) {
                    array.push(serializer.serialize(i, options));
                }
            }
            return array;
        }
        else if (!options || !options.ignoreErrors) {
            throw new Error(`Cannot serialize "${value}" as array`);
        }
        else {
            return undefined;
        }
    }
    unserialize(json, options) {
        if (Array.isArray(json)) {
            const array = [];
            if (this.typeOrSerializer instanceof Serializer) {
                for (const i of json) {
                    array.push(this.typeOrSerializer.unserialize(i, options));
                }
            }
            else {
                let serializer = this.typeOrSerializer && findTypeSerializer(this.typeOrSerializer, options === null || options === void 0 ? void 0 : options.typeProviders);
                if (!serializer) {
                    serializer = this.typeOrSerializer ? new ObjectSerializer(this.typeOrSerializer) : ObjectSerializer.instance;
                }
                for (const i of json) {
                    array.push(serializer.unserialize(i, options));
                }
            }
            return array;
        }
        else if (this.isUndefinedOrNull(json)) {
            return this.unserializeUndefinedOrNull(json, options);
        }
        else if (!options || !options.ignoreErrors) {
            throw new Error(`Cannot unserialize "${json}" to array`);
        }
        else {
            return undefined;
        }
    }
}
(function (ArraySerializer) {
    ArraySerializer.ofAny = new ArraySerializer();
    ArraySerializer.ofString = new ArraySerializer(String);
    ArraySerializer.ofNumber = new ArraySerializer(Number);
    ArraySerializer.ofBoolean = new ArraySerializer(Boolean);
})(ArraySerializer || (ArraySerializer = {}));
//# sourceMappingURL=ArraySerializer.js.map