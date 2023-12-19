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

export const championIDs = Object.keys(championsByID);

export function getChampionByID(championID: string) {
    // TODO Guard against null?
    return championsByID[championID];
}

export function getImageURL(championID: string) {
    return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championID}.png`;
}