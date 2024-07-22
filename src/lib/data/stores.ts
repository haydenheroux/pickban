import { trigger, type Trigger } from "$lib/util/trigger";
import { storable, type Storable } from "$lib/util/storable";

type ChampionID = string;

class Filter<K extends string | number | symbol, V> {
    store: Storable<Record<K, Array<V>>>;
    refresh: Trigger;

    constructor(name: string) {
        this.store = storable<Record<K, Array<V>>>(name, {} as Record<K, Array<V>>);
        this.refresh = trigger();
    }

    matches(value: V | null, key: K | null): boolean {
        if (value == null || key == null) return false;

        const associations = this.store.get();

        const matchingIDs = new Set(associations[key]);

        return matchingIDs.has(value);
    }
    
    predicate(key: K | null): (value: V | null) => boolean {
        // Usually null would be considered no match, but override that behavior here
        if (key == null) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return (value) => true;
        }

        return (value) => this.matches(value, key);
    }

    associate(value: V | null, key: K) {
        if (value == null) return;

        const associations = this.store.get();

        const matchingIDs = new Set(associations[key]);

        if (matchingIDs.has(value) == false) {
            matchingIDs.add(value);
        }

        associations[key] = [...matchingIDs];

        this.store.set(associations);

        this.refresh.trigger();
    }

    dissociate(value: V | null, key: K) {
        if (value == null) return;

        const associations = this.store.get();

        const matchingIDs = new Set(associations[key]);

        if (matchingIDs.has(value)) {
            matchingIDs.delete(value);
        }

        associations[key] = [...matchingIDs];

        this.store.set(associations);

        this.refresh.trigger();
    }

    callback(callback: () => void) {
        this.refresh.onTrigger(callback);
    }
}

export enum Lane {
    Top = "Top",
    Jungle = "Jungle",
    Middle = "Middle",
    Bottom = "Bottom",
    Support = "Support"
} 

export const lanes = new Filter<Lane, ChampionID>("lanes");

export enum Color {
    Red = "Red",
    Green = "Green",
    Blue = "Blue",
    White = "White",
    Black = "Black"
}

export const colors = new Filter<Color, ChampionID>("colors");

export const hideContextMenus = trigger();

export interface Picks {
    red: Array<string | null>;
    blue: Array<string | null>;
}

export const picks = storable<Picks>("picks", {red: [], blue: []} as Picks);