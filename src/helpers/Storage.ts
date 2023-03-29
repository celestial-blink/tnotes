class Storage {
    setValue({ key, value }: { key: string, value: Object }) {
        if (key && value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    }
    getValue<T>(key: string): T | null {
        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        return null;
    }
}

export default Storage;
