import { createFragment, createPattern } from "@utils/fragments";

createFragment("UPPER_CASE", "[A-Z]");
createFragment("LOWER_CASE", "[a-z]");
createFragment("UNDERSCORE", "_");
createFragment("DIGIT", "[0-9]");
createFragment("ID", "{{UPPER_CASE}}|{{LOWER_CASE}}|{{UNDERSCORE}}");

export default {
	// Blocks
	MODULE: /module/,
	EXIT: /exit/,
	EOL: /\n\r|\r|\n/,
	FUNCTION: /fun/,
	PARAMS_START: /\(/,
	PARAMS_END: /\)/,
	COMMA: /\,/,
	BLOCK_START: /\:/,
	BLOCK_END: /end/,
	CASE: /case/,
	//	Operators
	AND: /\&\&/,
	OR: /\|\|/,
	EQUAL: /\=\=/,
	DIFFERENT: /\!\=/,
	ASSIGN: /\=/,
	ASSIGN_FUNCTION: /\-\>/,
	ASSIGN_RETURN: /\<\-/,
	PIPE: /\|\>/,
	SUB_MODULE: /\./,
	GREATER_OR_EQUAL: /\>\=/,
	GREATER: /\>/,
	SMALLER_OR_EQUAL: /\<\=/,
	SMALLER: /\</,
	ADD: /\+/,
	SUBTRACT: /\-/,
	MULTIPLY: /\*/,
	DIVIDE: /\//,
	MOD: /\%/,
	UNDERSCORE: /\_/,
	// Data
	LIST_START: /\[/,
	LIST_END: /\]/,
	DICT_START: /\{/,
	DICT_END: /\}/,
	NULL: /Nil/,
	STRING: /\"(.)*\"|\'(.)*\'/,
	BOOLEAN: /true|false/,
	NUMBER: createPattern("{{DIGIT}}+(\\.{{DIGIT}}+)?"),
	COMMENT: /\#/,
	// OPERATOR
	MODULE_ID: createPattern("({{UPPER_CASE}}({{LOWER_CASE}}|{{DIGIT}})*)+"),
	DEFAULT_ID: createPattern("{{ID}}({{ID}}|{{DIGIT}})*"),
	// Skip
	SKIP: /\s|\t/,
};
