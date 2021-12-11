import * as Chevrotain from "chevrotain";

export function createToken(name: string, pattern: RegExp, skip = false) {
	const options = {
		name,
		pattern,
	};

	if (skip) {
		Object.assign(options, {
			group: Chevrotain.Lexer.SKIPPED,
		});
	}

	return Chevrotain.createToken(options);
}

export function generateTokens(input: string, tokens: Chevrotain.TokenType[]) {
	const lexer = new Chevrotain.Lexer(tokens);
	return lexer.tokenize(input);
}
