import { Serializer, SerializationOptions } from "./index";
export declare class StringSerializer extends Serializer {
    static readonly INSTANCE: StringSerializer;
    serialize(value: any, options?: SerializationOptions): any;
    unserialize(value: any, options?: SerializationOptions): any;
}
