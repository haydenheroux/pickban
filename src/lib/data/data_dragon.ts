async function getChampions() {
    const response = await fetch("https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/champion.json");
    const json = await response.json();

    return json;
}

export const json = await getChampions();

export const champions = json.data;

export function getImageURL(champion: string) {
    return `https://ddragon.leagueoflegends.com/cdn/${json.version}/img/champion/${champion}.png`;
}