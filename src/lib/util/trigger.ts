export interface Trigger {
    onTrigger: (callback: () => void) => void;
    trigger: () => void;
}

export function trigger(): Trigger {
    const callbacks: Array<() => void> = [] as Array<() => void>;

    return {
        onTrigger: (callback: () => void) => {
            callbacks.push(callback);
        },
        trigger: () => {
            for (const callback of callbacks) {
                callback();
            }
        },
    }
}