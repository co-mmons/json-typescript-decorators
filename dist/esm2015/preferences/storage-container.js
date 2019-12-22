import { PreferencesCollectionRefImpl } from "./collection-impl";
import { deepClone } from "./deep-clone";
export class StoragePreferencesContainer {
    constructor(storage) {
        this.storage = storage;
    }
    getStorageItem(storageKey) {
        return JSON.parse(this.storage.getItem(storageKey));
    }
    setStorageItem(storageKey, item) {
        this.storage.setItem(storageKey, JSON.stringify(item));
    }
    isCollectionStorageKey(collection, storageKey) {
        return storageKey.startsWith(collection + "/");
    }
    storageKey(collection, key) {
        return `${collection}/${JSON.stringify(key)}`;
    }
    realKey(collection, storageKey) {
        return JSON.parse(storageKey.replace(new RegExp(`^${collection}\/`), ""));
    }
    set(collection, key, value) {
        const itemKey = this.storageKey(collection, key);
        let item = this.getStorageItem(itemKey);
        if (item) {
            item.value = value;
        }
        else {
            item = { value: value };
        }
        this.setStorageItem(itemKey, item);
        return Promise.resolve({ key: deepClone(key), collection, value });
    }
    get(collection, key) {
        const item = this.getStorageItem(this.storageKey(collection, key));
        return Promise.resolve((item && { collection, key: deepClone(key), value: item.value }) || null);
    }
    delete(collection, keysOrFilter) {
        const deleted = [];
        if (Array.isArray(keysOrFilter)) {
            KEYS: for (const key of keysOrFilter) {
                const itemKey = this.storageKey(collection, key);
                for (let i = 0; i < this.storage.length; i++) {
                    const storageKey = this.storage.key(i);
                    if (itemKey === storageKey) {
                        const item = this.getStorageItem(storageKey);
                        deleted.push({ collection, key, value: item.value });
                        continue KEYS;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.storage.length; i++) {
                const storageKey = this.storage.key(i);
                if (this.isCollectionStorageKey(collection, storageKey)) {
                    const key = this.realKey(collection, storageKey);
                    const item = this.getStorageItem(storageKey);
                    if (!keysOrFilter || keysOrFilter(key, item.value)) {
                        deleted.push({ collection, key, value: item.value });
                    }
                }
            }
        }
        return Promise.resolve(deleted);
    }
    exists(collection, key) {
        const item = this.getStorageItem(this.storageKey(collection, key));
        return Promise.resolve(!!item);
    }
    items(collection, keysOrFilter) {
        const items = [];
        if (Array.isArray(keysOrFilter)) {
            KEYS: for (const key of keysOrFilter) {
                const itemKey = this.storageKey(collection, key);
                for (let i = 0; i < this.storage.length; i++) {
                    const storageKey = this.storage.key(i);
                    if (itemKey === storageKey) {
                        const item = this.getStorageItem(storageKey);
                        items.push({ collection, key, value: item.value });
                        continue KEYS;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.storage.length; i++) {
                const storageKey = this.storage.key(i);
                if (this.isCollectionStorageKey(collection, storageKey)) {
                    const key = this.realKey(collection, storageKey);
                    const item = this.getStorageItem(storageKey);
                    if (!keysOrFilter || keysOrFilter(key, item.value)) {
                        items.push({ collection, key, value: item.value });
                    }
                }
            }
        }
        return Promise.resolve(items);
    }
    update(collection, key, changes) {
        const storageKey = this.storageKey(collection, key);
        const rawItem = this.storage.getItem(storageKey);
        if (rawItem) {
            const oldItem = JSON.parse(rawItem);
            let newValue = oldItem.value;
            if (changes) {
                newValue = Object.assign({}, newValue, changes);
                this.setStorageItem(storageKey, { value: newValue });
            }
            return Promise.resolve({ collection, key, value: deepClone(newValue) });
        }
        else {
            return Promise.reject(new Error("Key not exists"));
        }
    }
    collection(name) {
        return new PreferencesCollectionRefImpl(this, name);
    }
}
//# sourceMappingURL=storage-container.js.map