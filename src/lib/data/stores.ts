import { trigger } from '$lib/util/trigger';
import { storable } from '$lib/util/storable';
import { Filter } from '$lib/util/filter';
import { Selector } from '$lib/util/selector';
import { colorAssets, damageAssets, laneAssets, type Asset } from './assets';
import type { Color, Damage, Lane } from './enums';

type ChampionID = string;

class Entry<K extends string | number | symbol, V> {
	filter: Filter<K, V>;
	selector: Selector<K>;
	assets: Array<Asset<K>>;

	constructor(name: string, assets: Array<Asset<K>>) {
		this.filter = new Filter<K, V>(name);
		this.selector = new Selector<K>();
		this.assets = assets;
	}

	onChange(callback: () => void) {
		this.filter.onChange(callback);
		this.selector.onChange(callback);
	}
}

const lane = new Entry<Lane, ChampionID>('lanes', laneAssets);

const color = new Entry<Color, ChampionID>('colors', colorAssets);

const damage = new Entry<Damage, ChampionID>('damages', damageAssets);

export const entries = [lane, damage, color];

export const hideContextMenus = trigger();

export interface Picks {
	red: Array<string | null>;
	blue: Array<string | null>;
}

export const picks = storable<Picks>('picks', { red: [], blue: [] } as Picks);
