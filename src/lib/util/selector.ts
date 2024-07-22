import { trigger, type Trigger } from "./trigger";

export class Selection<T> {
    selected: T | null = null;
    trigger: Trigger;

    constructor(...callbacks: Array<() => void>) {
        this.trigger = trigger();

        for (const callback of callbacks) {
            this.trigger.onTrigger(callback);
        }
    }

    select(value: T) {
        if (this.selected != value) {
            this.selected = value;
        } else {
            this.selected = null;
        }

        this.trigger.trigger();
    }
}