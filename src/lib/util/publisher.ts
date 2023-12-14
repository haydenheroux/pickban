export function publisher() {
    const callbacks: Array<() => void> = [] as Array<() => void>;

    return {
        subscribe: (callback: () => void) => {
            callbacks.push(callback);
        },
        publish: () => {
            for (const callback of callbacks) {
                callback();
            }
        },
    }
}