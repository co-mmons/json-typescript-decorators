import {AssignableType, resolveForwardRef, Type} from "../core";
import {property} from "./decorators/property";
import {PropertyConfig} from "./decorators/PropertyConfig";
import {findTypeSerializer} from "./findTypeSerializer";
import {getPrototypesTree} from "./getPrototypesTree";
import {identifyType} from "./identifyType";
import {InternalType} from "./InternalType";
import {SerializationOptions} from "./SerializationOptions";
import {Serializer} from "./Serializer";
import {ObjectSerializer} from "./serializers/ObjectSerializer";

export function toJsonImpl(this: any, options?: SerializationOptions) {

    const prototypesTree = getPrototypesTree(this);
    const typesTree = getTypesTree(prototypesTree);

    let json: any = {};

    // call toJSON for super types, only if hard coded in a class
    for (let t = 1; t < typesTree.length; t++) {
        if (!typesTree[t].__jsonToJson && prototypesTree[t].hasOwnProperty("toJSON")) {

            const prototypeJson = prototypesTree[t].toJSON.call(this, options);
            if (prototypeJson && typeof prototypeJson === "object") {
                json = prototypeJson;
            }

            break;
        }
    }

    const properties = getDeclaredProperties(this, typesTree);

    for (const propertyName in properties) {
        const config = properties[propertyName] as PropertyConfig;
        const value = this[propertyName];
        const type = config.propertyType ? config.propertyType : identifyType(value);
        const serializer = type instanceof Serializer ? type : findTypeSerializer(type, typesTree[0].__jsonTypes);
        const name = config.propertyJsonName ? config.propertyJsonName : propertyName;

        if (serializer) {
            json[name] = serializer.serialize(value);
        } else {
            json[name] = ObjectSerializer.instance.serialize(value);
        }
    }

    if ((typesTree[0] as InternalType).jsonTypeName) {
        json["@type"] = (typesTree[0] as InternalType).jsonTypeName;
    }

    return json;
}

export function fromJsonImpl(this: AssignableType, json: any, options?: SerializationOptions) {

    const internalType = this as InternalType;

    let instance: any;

    if (!instance && internalType.__jsonSubtypes) {
        for (const subtype of internalType.__jsonSubtypes) {

            let matchedType: InternalType & AssignableType;

            if (subtype.matcher) {

                const match = subtype.matcher(json);
                if (match) {
                    matchedType = resolveForwardRef(match);
                }

            } else if (subtype.property && ((typeof subtype.value === "function" && subtype.value(json[subtype.property])) || (typeof subtype.value !== "function" && json[subtype.property] === subtype.value))) {
                matchedType = resolveForwardRef(subtype.type);
            }

            if (matchedType && matchedType !== this) {

                if (matchedType.hasOwnProperty("fromJSON")) {
                    return matchedType.fromJSON(json, options);
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

    const properties = getDeclaredProperties(instance, typesTree);

    // property names that already unserialized
    const unserializedProperties: string[] = [];

    // unserialize known properties
    for (const propertyName in properties) {
        const config = properties[propertyName] as PropertyConfig;
        const name = config.propertyJsonName ? config.propertyJsonName : propertyName;

        if (name in json) {
            const value = json[name];
            const type = config.propertyType ? config.propertyType : identifyType(value);
            const serializer = type instanceof Serializer ? type : findTypeSerializer(type) || ObjectSerializer.instance;

            instance[propertyName] = serializer.unserialize(value, config);
            unserializedProperties.push(name);
        }
    }

    // copy json properties, that were not unserialized above
    for (const propertyName in json) {
        if (unserializedProperties.indexOf(propertyName) < 0) {
            instance[propertyName] = ObjectSerializer.instance.unserialize(json[propertyName]);
        }
    }

    return instance;
}

function getTypesTree(prototypes: any[]): Array<Type & InternalType> {
    return prototypes.map(type => type.constructor);
}

function getDeclaredProperties(thiz: any, types: Type[]): {[propertyName: string]: PropertyConfig} {

    const names = Object.getOwnPropertyNames(thiz);

    let properties: {[propertyName: string]: {}} = {};

    for (const propertyName in thiz) {
        if (typeof thiz[propertyName] !== "function") {
            properties[propertyName] = {};
        }
    }

    for (let t = types.length - 1; t >= 0; t--) {
        const internalType = types[t] as InternalType;

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
