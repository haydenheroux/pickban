import { trigger } from "$lib/util/trigger";
import { storable } from "$lib/util/storable";

export enum Lane {
    Top = "Top",
    Jungle = "Jungle",
    Middle = "Middle",
    Bottom = "Bottom",
    Support = "Support"
} 

export const lanes = storable<Record<Lane, Array<string>>>("lanes", {} as Record<Lane, Array<string>>);

export function isLane(lane: Lane, championIDOrNull: string | null): boolean {
    if (championIDOrNull == null) return false;

    const favoritesObject = lanes.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    return laneFavorites.has(championIDOrNull);
}

export function addLane(lane: Lane, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const favoritesObject = lanes.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    if (!laneFavorites.has(championIDOrNull)) {
        laneFavorites.add(championIDOrNull);
    }

    favoritesObject[lane] = [...laneFavorites];

    lanes.set(favoritesObject);

    refreshLanes.trigger();
}

export function removeLane(lane: Lane, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const favoritesObject = lanes.get();

    const laneFavorites = new Set(favoritesObject[lane]);

    if (laneFavorites.has(championIDOrNull)) {
        laneFavorites.delete(championIDOrNull);
    }

    favoritesObject[lane] = [...laneFavorites];

    lanes.set(favoritesObject);

    refreshLanes.trigger();
}

export const refreshLanes = trigger();

export enum Color {
    Red = "Red",
    Green = "Green",
    Blue = "Blue",
    White = "White",
    Black = "Black"
}

export const colors = storable<Record<Color, Array<string>>>("colors", {} as Record<Color, Array<string>>)

export function isColored(color: Color, championIDOrNull: string | null): boolean {
    if (championIDOrNull == null) return false;

    const colorsObject = colors.get();

    const colorColors = new Set(colorsObject[color]);

    return colorColors.has(championIDOrNull);
}

export function addColor(color: Color, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const colorsObject = colors.get();

    const colorColors = new Set(colorsObject[color]);

    if (!colorColors.has(championIDOrNull)) {
        colorColors.add(championIDOrNull);
    }

    colorsObject[color] = [...colorColors];

    colors.set(colorsObject);

    refreshColors.trigger();
}

export function removeColor(color: Color, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const colorsObject = colors.get();

    const colorColors = new Set(colorsObject[color]);

    if (colorColors.has(championIDOrNull)) {
        colorColors.delete(championIDOrNull);
    }

    colorsObject[color] = [...colorColors];

    colors.set(colorsObject);

    refreshColors.trigger();
}

export const refreshColors = trigger();

export const hideContextMenus = trigger();