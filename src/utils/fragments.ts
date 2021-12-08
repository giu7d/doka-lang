import XRegExp from "xregexp";

const fragments = {};

export function createFragment(name: string, pattern: string) {
	return Object.assign(fragments, {
		[name]: XRegExp.build(pattern, fragments),
	});
}

export function createPattern(pattern: string, flags?: string) {
	return XRegExp.build(pattern, fragments, flags);
}
