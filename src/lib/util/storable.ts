import { browser } from '$app/environment';
import { writable, type Subscriber } from 'svelte/store';

export interface Storable<T> {
	get: () => T;
	set: (value: T) => void;
	clear: () => void;
	subscribe: (subscriber: Subscriber<T>) => void;
}

export function storable<T>(key: string, fallback: T): Storable<T> {
	const store = writable(fallback);

	if (browser) {
		const valueOrNull = localStorage.getItem(key);

		if (valueOrNull != null) {
			const value = JSON.parse(valueOrNull);

			store.set(value);
		}
	}

	return {
		get: (): T => {
			if (!browser) return fallback;

			const valueOrNull = localStorage.getItem(key);

			if (valueOrNull === null) {
				console.log(`Key ${key} was null`);

				localStorage.setItem(key, JSON.stringify(fallback));

				return fallback;
			}

			const value = JSON.parse(valueOrNull);

			return value;
		},
		set: (value: T) => {
			if (!browser) return;

			store.set(value);

			localStorage.setItem(key, JSON.stringify(value));
		},
		clear: () => {
			if (!browser) return;

			store.set(fallback);

			localStorage.setItem(key, JSON.stringify(fallback));
		},
		subscribe: (subscriber: Subscriber<T>) => {
			store.subscribe(subscriber);
		}
	};
}
