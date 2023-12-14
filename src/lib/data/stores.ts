import { publisher } from "$lib/util/publisher";
import { storable } from "$lib/util/storable";

export enum Lane {
    Top = "TOP",
    Jungle = "JUNGLE",
    Middle = "MIDDLE",
    Bottom = "BOTTOM",
    Support = "SUPPORT"
} 

export const favorites = storable<Record<Lane, Array<string>>>("favorites", {} as Record<Lane, Array<string>>);

export function hasFavorite(lane: Lane, champion: string): boolean {
    const favoritesObject = favorites.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    return laneFavorites.has(champion);
}

export function addFavorite(lane: Lane, champion: string) {
    const favoritesObject = favorites.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    if (!laneFavorites.has(champion)) {
        laneFavorites.add(champion);
    }

    favoritesObject[lane] = [...laneFavorites];

    favorites.set(favoritesObject);
}

export function removeFavorite(lane: Lane, champion: string) {
    const favoritesObject = favorites.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    if (laneFavorites.has(champion)) {
        laneFavorites.delete(champion);
    }

    favoritesObject[lane] = [...laneFavorites];

    favorites.set(favoritesObject);
}

export const contextMenu = publisher();