import { trigger } from "$lib/util/trigger";
import { storable } from "$lib/util/storable";

export enum Lane {
    Top = "Top",
    Jungle = "Jungle",
    Middle = "Middle",
    Bottom = "Bottom",
    Support = "Support"
} 

export const favorites = storable<Record<Lane, Array<string>>>("favorites", {} as Record<Lane, Array<string>>);

export function isFavorite(lane: Lane, championIDOrNull: string | null): boolean {
    if (championIDOrNull == null) return false;

    const favoritesObject = favorites.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    return laneFavorites.has(championIDOrNull);
}

export function addFavorite(lane: Lane, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const favoritesObject = favorites.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    if (!laneFavorites.has(championIDOrNull)) {
        laneFavorites.add(championIDOrNull);
    }

    favoritesObject[lane] = [...laneFavorites];

    favorites.set(favoritesObject);
}

export function removeFavorite(lane: Lane, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const favoritesObject = favorites.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    if (laneFavorites.has(championIDOrNull)) {
        laneFavorites.delete(championIDOrNull);
    }

    favoritesObject[lane] = [...laneFavorites];

    favorites.set(favoritesObject);
}

export const hideContextMenus = trigger();