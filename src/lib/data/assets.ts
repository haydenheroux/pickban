import { Color, Lane, Damage } from './stores';

interface Asset<T> {
	type: T;
	src: string;
}

function asset<T>(type: T, src: string): Asset<T> {
	return { type, src };
}

export const lanes: Array<Asset<Lane>> = [
	asset(Lane.Top, 'roles/top.png'),
	asset(Lane.Jungle, 'roles/jungle.png'),
	asset(Lane.Middle, 'roles/middle.png'),
	asset(Lane.Bottom, 'roles/bottom.png'),
	asset(Lane.Support, 'roles/support.png')
];

export const colors = [
	asset(Color.Red, 'colors/red.svg'),
	asset(Color.Green, 'colors/green.svg'),
	asset(Color.Blue, 'colors/blue.svg'),
	asset(Color.White, 'colors/white.svg'),
	asset(Color.Black, 'colors/black.svg'),
	asset(Color.Colorless, 'colors/colorless.svg')
];

export const damages = [
	asset(Damage.Physical, 'types/physical.png'),
	asset(Damage.Magic, 'types/magic.png'),
	asset(Damage.CrowdControl, 'types/cc.png')
];

export const close = 'ui/close.png';

export const map = 'map/map.jpg';
