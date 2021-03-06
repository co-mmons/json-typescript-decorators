import { Type } from "../../core";
import { JsonTypeName } from "../JsonTypeName";
import { TypeProvider } from "../TypeProvider";
import { PropertyConfig } from "./PropertyConfig";
export declare function serializable(options?: JsonSerializableOptions): (classType: Type) => void;
declare type Types = Array<TypeProvider | TypeProvider[] | (Type & JsonTypeName) | Types>;
declare type Properties = {
    [propertyName: string]: PropertyConfig;
};
export interface JsonSerializableOptions {
    types?: Types;
    properties?: Properties | "*";
}
export {};
