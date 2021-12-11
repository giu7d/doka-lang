import { TokenType } from "chevrotain";

import Grammar from "@modules/lexer/grammar";
import { createToken } from "@modules/lexer/service/ChevrotainLexer";

type IGrammarKeys = keyof typeof Grammar;

type IGrammar = Record<IGrammarKeys, TokenType>;

const keys = Object.keys(Grammar) as IGrammarKeys[];

const grammarInitialValue = {} as IGrammar;

export const grammar: IGrammar = keys.reduce((accumulated, key) => {
	const item = Grammar[key as keyof typeof Grammar];
	const token = createToken(key, item, key === "SKIP");
	return {
		...accumulated,
		[key]: token,
	};
}, grammarInitialValue);

export const tokens: TokenType[] = Object.keys(grammar).map(
	(key) => grammar[key as keyof typeof grammar]
);

export { generateTokens } from "@modules/lexer/service/ChevrotainLexer";
