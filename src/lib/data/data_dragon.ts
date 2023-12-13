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

export const champions = json.data;

export function getChampionName(champion: string) {
    return champions[champion].name;
}

export function getImageURL(champion: string) {
    return `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion}.png`;
}