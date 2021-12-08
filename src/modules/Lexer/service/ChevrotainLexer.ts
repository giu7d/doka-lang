import { TokenType, createToken, Lexer as ChevrotainLexer } from "chevrotain";

export class Lexer {
	static createToken(name: string, pattern: RegExp, skip = false) {
		const options = {
			name,
			pattern,
		};

		if (skip) {
			Object.assign(options, {
				group: ChevrotainLexer.SKIPPED,
			});
		}

		return createToken(options);
	}

	static parse(tokens: TokenType[], input: string) {
		const lexer = new ChevrotainLexer(tokens);
		return lexer.tokenize(input);
	}
}
