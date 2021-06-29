export const loadStateLS = (stateKey: string) => {
    try {
        const serializedState = localStorage.getItem(stateKey);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
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