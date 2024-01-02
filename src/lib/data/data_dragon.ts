async function getLatestVersion() {
    const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    const json = await response.json();

    return json[0];
}

async function getChampions(version: string) {
    const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
    const json = await response.json();

    return json;
}

export const latestVersion = await getLatestVersion();

export const json = await getChampions(latestVersion);

const championsByID = json.data;

export const allChampionIDs = Object.keys(championsByID);

export function getChampionByID(championIDOrNull: string | null) {
    if (championIDOrNull == null) return null;

    const championID = championIDOrNull;

    return championsByID[championID];
}

export function getChampionNameOrNull(championIDOrNull: string | null): string {
    if (championIDOrNull == null) return "";

    return getChampionByID(championIDOrNull).name;
}

export function getImageURLOrNull(championIDOrNull: string | null): string | null {
    if (championIDOrNull == null) return null;

    const championID = championIDOrNull;

    return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championID}.png`;
}

export function getImageOrNull(championIDOrNull: string | null): HTMLImageElement | null {
    if (!championIDOrNull) return null;

    let imageOrNull = new Image();

    if (!imageOrNull) return null;

    imageOrNull.src = getImageURLOrNull(championIDOrNull)!!;

    return imageOrNull;
}