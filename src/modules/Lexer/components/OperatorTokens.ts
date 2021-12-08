import { Lexer } from "@modules/Lexer/service/ChevrotainLexer";

export const AND = Lexer.createToken("AND", /\&\&/);
export const OR = Lexer.createToken("OR", /\|\|/);
export const EQUAL = Lexer.createToken("EQUAL", /\=\=/);
export const DIFFERENT = Lexer.createToken("DIFFERENT", /\!\=/);
export const ASSIGN = Lexer.createToken("ASSIGN", /\=/);
export const ASSIGN_FUNCTION = Lexer.createToken("ASSIGN_FUNCTION", /->/);
export const ASSIGN_RETURN = Lexer.createToken("ASSIGN_RETURN", /<-/);
export const PIPE = Lexer.createToken("PIPE", /\|\>/);
export const SUB_MODULE = Lexer.createToken("SUB_MODULE", /\./);
export const GREATER = Lexer.createToken("GREATER", /\>/);
export const GREATER_OR_EQUAL = Lexer.createToken("GREATER_OR_EQUAL", /\>\=/);
export const SMALLER = Lexer.createToken("SMALLER", /\</);
export const SMALLER_OR_EQUAL = Lexer.createToken("SMALLER_OR_EQUAL", /\<\=/);
export const ADD = Lexer.createToken("ADD", /\+/);
export const SUBTRACT = Lexer.createToken("SUBTRACT", /\-/);
export const MULTIPLY = Lexer.createToken("MULTIPLY", /\*/);
export const DIVIDE = Lexer.createToken("DIVIDE", /\//);
export const MOD = Lexer.createToken("MOD", /\%/);
export const UNDERSCORE = Lexer.createToken("UNDERSCORE", /\_/);

export const OPERATOR_TOKENS = [
	AND,
	OR,
	EQUAL,
	DIFFERENT,
	ASSIGN,
	ASSIGN_FUNCTION,
	ASSIGN_RETURN,
	PIPE,
	SUB_MODULE,
	GREATER,
	GREATER_OR_EQUAL,
	SMALLER,
	SMALLER_OR_EQUAL,
	ADD,
	SUBTRACT,
	MULTIPLY,
	DIVIDE,
	MOD,
	UNDERSCORE,
];
