import { trigger, type Trigger } from "$lib/util/trigger";
import { storable, type Storable } from "$lib/util/storable";

type ChampionID = string;

class Filter<T extends string | number | symbol> {
    store: Storable<Record<T, Array<ChampionID>>>;
    refresh: Trigger;

    constructor(name: string) {
        this.store = storable<Record<T, Array<ChampionID>>>(name, {} as Record<T, Array<ChampionID>>);
        this.refresh = trigger();
    }

    matches(id: ChampionID | null, value: T | null): boolean {
        if (id == null || value == null) return false;

        const associations = this.store.get();

        const matchingIDs = new Set(associations[value]);

        return matchingIDs.has(id);
    }
    
    predicate(value: T | null): (id: ChampionID | null) => boolean {
        // Usually null would be considered no match, but override that behavior here
        if (value == null) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            return (id) => true;
        }

        return (id) => this.matches(id, value);
    }

    associate(id: ChampionID | null, value: T) {
        if (id == null) return;

        const associations = this.store.get();

        const matchingIDs = new Set(associations[value]);

        if (matchingIDs.has(id) == false) {
            matchingIDs.add(id);
        }

        associations[value] = [...matchingIDs];

        this.store.set(associations);

        this.refresh.trigger();
    }

    dissociate(id: ChampionID | null, value: T) {
        if (id == null) return;

        const associations = this.store.get();

        const matchingIDs = new Set(associations[value]);

        if (matchingIDs.has(id)) {
            matchingIDs.delete(id);
        }

        associations[value] = [...matchingIDs];

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

export const lanes = new Filter<Lane>("lanes");

export enum Color {
    Red = "Red",
    Green = "Green",
    Blue = "Blue",
    White = "White",
    Black = "Black"
}

export const colors = new Filter<Color>("colors");

export const hideContextMenus = trigger();

export interface Picks {
    red: Array<string | null>;
    blue: Array<string | null>;
}

export const picks = storable<Picks>("picks", {red: [], blue: []} as Picks);