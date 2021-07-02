export const loadStateLS = <Type>(stateKey: string): Type | null => {
    try {
        const serializedState = localStorage.getItem(stateKey);
        if (serializedState === null) {
            return null;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return null;
    }
}

export const saveStateLS = (stateValue: any, stateKey: string) => {
    try {
        const serializedState = JSON.stringify(stateValue);

        localStorage.setItem(stateKey, serializedState);
    } catch (err) {
        console.log(err);
    }
}