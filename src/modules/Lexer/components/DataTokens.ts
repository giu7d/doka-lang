import { Lexer } from "@modules/Lexer/service/ChevrotainLexer";
import { createFragment, createPattern } from "@utils/fragments";

createFragment("DIGIT", "[0-9]");

export const LIST_START = Lexer.createToken("LIST_START", /\[/);
export const LIST_END = Lexer.createToken("LIST_END", /\]/);
export const DICT_START = Lexer.createToken("DICT_START", /\{/);
export const DICT_END = Lexer.createToken("DICT_END", /\}/);

export const NULL = Lexer.createToken("NULL", /Nil/);
export const STRING = Lexer.createToken("STRING", /\"(.)*\"|\'(.)*\'/);
export const BOOLEAN = Lexer.createToken("BOOLEAN", /true|false/);
export const NUMBER = Lexer.createToken(
	"NUMBER",
	createPattern("{{DIGIT}}+(\\.{{DIGIT}}+)?")
);

export const COMMA = Lexer.createToken("COMMA", /\,/);
export const COMMENT = Lexer.createToken("COMMENT", /\#/);

export const DATA_TOKENS = [
	NULL,
	LIST_START,
	LIST_END,
	DICT_START,
	DICT_END,
	STRING,
	BOOLEAN,
	NUMBER,
	COMMA,
	COMMENT,
];
