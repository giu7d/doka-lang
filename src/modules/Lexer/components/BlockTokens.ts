import { Lexer } from "@modules/Lexer/service/ChevrotainLexer";

export const MODULE = Lexer.createToken("MODULE", /module/);
export const EXIT = Lexer.createToken("EXIT", /exit/);
export const EOL = Lexer.createToken("EOL", /\n\r|\r|\n/);
export const FUNCTION = Lexer.createToken("FUNCTION", /fun/);
export const PARAMS_START = Lexer.createToken("PARAMS_START", /\(/);
export const PARAMS_END = Lexer.createToken("PARAMS_END", /\)/);
export const IF = Lexer.createToken("IF", /if/);
export const ELSE = Lexer.createToken("ELSE", /else/);
export const ELSEIF = Lexer.createToken("ELSEIF", /else\sif/);
export const BLOCK_START = Lexer.createToken("BLOCK_START", /:/);
export const BLOCK_END = Lexer.createToken("BLOCK_END", /end/);

export const BLOCK_TOKENS = [
	MODULE,
	EXIT,
	EOL,
	FUNCTION,
	PARAMS_START,
	PARAMS_END,
	IF,
	ELSE,
	ELSEIF,
	BLOCK_START,
	BLOCK_END,
];
