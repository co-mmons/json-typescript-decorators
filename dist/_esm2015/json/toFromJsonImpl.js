import { resolveForwardRef } from "../core";
import { findTypeSerializer } from "./findTypeSerializer";
import { getPrototypesTree } from "./getPrototypesTree";
import { identifyType } from "./identifyType";
import { serializeImpl } from "./serializeImpl";
import { Serializer } from "./Serializer";
import { unserializeImpl } from "./unserializeImpl";
export function toJsonImpl() {
    const prototypesTree = getPrototypesTree(this);
    const typesTree = getTypesTree(prototypesTree);
    const serializationOptions = { typeProviders: typesTree[0].__jsonTypes };
    let json = {};
    // call toJSON for super types, only if hard coded in a class
    for (let t = 1; t < typesTree.length; t++) {
        if (!typesTree[t].__jsonToJson && prototypesTree[t].hasOwnProperty("toJSON")) {
            const prototypeJson = prototypesTree[t].toJSON.call(this);
            if (prototypeJson && typeof prototypeJson === "object") {
                json = prototypeJson;
            }
            break;
        }
    }
    const properties = getDeclaredProperties(this, typesTree);
    for (const propertyName in properties) {
        const config = properties[propertyName];
        const value = this[propertyName];
        if (value === undefined || typeof value === "function") {
            continue;
        }
        const type = config.propertyType ? config.propertyType : identifyType(value);
        const serializer = type instanceof Serializer ? type : findTypeSerializer(type, typesTree[0].__jsonTypes);
        const name = config.propertyJsonName ? config.propertyJsonName : propertyName;
        if (Array.isArray(value)) {
            json[name] = [];
            for (const i of value) {
                json[name].push(serializer ? serializer.serialize(i, serializationOptions) : serializeImpl(i, type, serializationOptions));
            }
        }
        else if (serializer) {
            json[name] = serializer.serialize(value, serializationOptions);
        }
        else {
            json[name] = serializeImpl(value, type, serializationOptions);
        }
    }
    if (typesTree[0].hasOwnProperty("jsonTypeName")) {
        json["@type"] = typesTree[0].jsonTypeName;
    }
    return json;
}
export function fromJsonImpl(json) {
    const internalType = this;
    let instance;
    if (!instance && internalType.__jsonSubtypes) {
        for (const subtype of internalType.__jsonSubtypes) {
            let matchedType;
            if (subtype.matcher) {
                const match = subtype.matcher(json);
                if (match) {
                    matchedType = resolveForwardRef(match);
                }
            }
            else if (subtype.property && ((typeof subtype.value === "function" && subtype.value(json[subtype.property])) || (typeof subtype.value !== "function" && json[subtype.property] === subtype.value))) {
                matchedType = resolveForwardRef(subtype.type);
            }
            if (matchedType && matchedType !== this) {
                if (matchedType.hasOwnProperty("fromJSON")) {
                    return matchedType.fromJSON(json);
                }
                instance = new matchedType;
                break;
            }
        }
    }
    if (!instance) {
        instance = new this();
    }
    const prototypesTree = getPrototypesTree(instance);
    const typesTree = getTypesTree(prototypesTree);
    const serializationOptions = { typeProviders: typesTree[0].__jsonTypes };
    const properties = getDeclaredProperties(instance, typesTree);
    // property names that already unserialized
    const unserializedProperties = [];
    // unserialize known properties
    for (const propertyName in properties) {
        const config = properties[propertyName];
        const name = config.propertyJsonName ? config.propertyJsonName : propertyName;
        if (name in json) {
            const value = json[name];
            if (typeof value === "function") {
                continue;
            }
            const type = config.propertyType ? config.propertyType : identifyType(value);
            const serializer = type instanceof Serializer ? type : findTypeSerializer(type, typesTree[0].__jsonTypes);
            if (Array.isArray(value)) {
                instance[propertyName] = [];
                for (const i of value) {
                    instance[propertyName].push(serializer ? serializer.unserialize(i, serializationOptions) : unserializeImpl(i, type, serializationOptions));
                }
            }
            else {
                instance[propertyName] = serializer ? serializer.unserialize(value, serializationOptions) : unserializeImpl(value, type, serializationOptions);
            }
            unserializedProperties.push(name);
        }
    }
    // copy json properties, that were not unserialized above
    for (const propertyName in json) {
        if (propertyName === "@type" && typesTree[0].jsonTypeName) {
            continue;
        }
        if (unserializedProperties.indexOf(propertyName) < 0) {
            instance[propertyName] = unserializeImpl(json[propertyName], null, serializationOptions);
        }
    }
    return instance;
}
function getTypesTree(prototypes) {
    return prototypes.map(type => type.constructor);
}
function getDeclaredProperties(thiz, types) {
    let properties = {};
    for (let t = types.length - 1; t >= 0; t--) {
        const internalType = types[t];
        if (internalType.__jsonSerialization) {
            if (internalType.__jsonProperties) {
                properties = Object.assign(properties, internalType.__jsonProperties);
            }
            if (internalType.__jsonIgnoredProperties) {
                for (const propertyName of internalType.__jsonIgnoredProperties) {
                    delete properties[propertyName];
                }
            }
        }
    }
    return properties;
}
//# sourceMappingURL=toFromJsonImpl.js.map