import { PreferencesCollectionRef, PreferencesItemRef, PreferencesSetOptions } from "./interfaces";
export declare class PreferenceItemRefImpl<Key, Value> implements PreferencesItemRef<Key, Value> {
    readonly collection: PreferencesCollectionRef<Key, Value>;
    readonly key: Key;
    constructor(collection: PreferencesCollectionRef<Key, Value>, key: Key);
    delete(): Promise<boolean>;
    value(): Promise<Value>;
    set(value: Value, options?: PreferencesSetOptions): Promise<import("./interfaces").PreferencesItem<Key, Value>>;
    update(value: Value): Promise<import("./interfaces").PreferencesItem<Key, Value>>;
}
