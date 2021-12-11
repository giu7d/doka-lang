import { IToken } from "chevrotain";

import { ChevrotainParser } from "@modules/parser/services/ChevrotainParser";

export function parse(tokens: IToken[]) {
	const parser = new ChevrotainParser();

	parser.input = tokens;

	const tree = parser.init();

	return {
		tree,
		errors: parser.errors,
	};
}
