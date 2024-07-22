import { Color, Lane, Type } from './stores';

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
	{ color: Color.Black, src: 'colors/black.svg' }
];

export const types = [
	{ type: Type.Physical, src: 'types/physical.png' },
	{ type: Type.Magic, src: 'types/magic.png' },
	{ type: Type.CrowdControl, src: 'types/cc.png' }
];

export const close = 'ui/close.png';

export const map = 'map/map.jpg';
