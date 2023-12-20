import { trigger } from "$lib/util/trigger";
import { storable } from "$lib/util/storable";

export enum Lane {
    Top = "Top",
    Jungle = "Jungle",
    Middle = "Middle",
    Bottom = "Bottom",
    Support = "Support"
} 

const marksStore = storable<Record<Lane, Array<string>>>("marks", {} as Record<Lane, Array<string>>);

export function isMarked(lane: Lane, championIDOrNull: string | null): boolean {
    if (championIDOrNull == null) return false;

    const marks = marksStore.get();

    const laneMarks = new Set(marks[lane]);

    return laneMarks.has(championIDOrNull);
}

export function addMark(lane: Lane, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const marks = marksStore.get();

    const laneMarks = new Set(marks[lane]);

    if (!laneMarks.has(championIDOrNull)) {
        laneMarks.add(championIDOrNull);
    }

    marks[lane] = [...laneMarks];

    marksStore.set(marks);
}

export function removeMark(lane: Lane, championIDOrNull: string | null) {
    if (championIDOrNull == null) return;

    const marks = marksStore.get();

    const laneMarks = new Set(marks[lane]);

    if (laneMarks.has(championIDOrNull)) {
        laneMarks.delete(championIDOrNull);
    }

    marks[lane] = [...laneMarks];

    marksStore.set(marks);
}

export const hideContextMenus = trigger();