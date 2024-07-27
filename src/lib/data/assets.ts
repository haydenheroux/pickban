import { Color, Lane, Damage } from './stores';

export const lanes = [
	{ lane: Lane.Top, src: 'roles/top.png' },
	{ lane: Lane.Jungle, src: 'roles/jungle.png' },
	{ lane: Lane.Middle, src: 'roles/middle.png' },
	{ lane: Lane.Bottom, src: 'roles/bottom.png' },
	{ lane: Lane.Support, src: 'roles/support.png' }
];

export const colors = [
	{ color: Color.Red, src: 'colors/red.svg' },
	{ color: Color.Green, src: 'colors/green.svg' },
	{ color: Color.Blue, src: 'colors/blue.svg' },
	{ color: Color.White, src: 'colors/white.svg' },
	{ color: Color.Black, src: 'colors/black.svg' },
	{ color: Color.Colorless, src: 'colors/colorless.svg' }
];

export const damages = [
	{ damage: Damage.Physical, src: 'types/physical.png' },
	{ damage: Damage.Magic, src: 'types/magic.png' },
	{ damage: Damage.CrowdControl, src: 'types/cc.png' }
];

export const close = 'ui/close.png';

export const map = 'map/map.jpg';
