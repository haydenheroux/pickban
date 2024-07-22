import { trigger, type Trigger } from './trigger';

export class Selector<T extends string | number | symbol> {
	selected: T | null = null;
	trigger: Trigger;

	constructor() {
		this.trigger = trigger();
	}

	callback(callback: () => void) {
		this.trigger.onTrigger(callback);
	}

	get(): T | null {
		return this.selected;
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
