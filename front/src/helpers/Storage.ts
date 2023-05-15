class Storage {
    setValue({ key, value }: { key: string, value: Object | string }) {
        if (key && value) {
            let prepareValue:string = typeof value === "object" ? JSON.stringify(value) : value;
            window.localStorage.setItem(key, prepareValue);
        }
    }
    getValue<T>(key: string):string | null {
        const item = window.localStorage.getItem(key);
        return item;
    }
    remove(key:string) {
        localStorage.removeItem(key);
    }
}

export default Storage;
