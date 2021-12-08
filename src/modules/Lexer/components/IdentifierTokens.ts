import { Lexer } from "@modules/Lexer/service/ChevrotainLexer";
import { createFragment, createPattern } from "@utils/fragments";

createFragment("UPPER_CASE", "[A-Z]");
createFragment("LOWER_CASE", "[a-z]");
createFragment("UNDERSCORE", "_");
createFragment("DIGIT", "[0-9]");
createFragment("ID", "{{UPPER_CASE}}|{{LOWER_CASE}}|{{UNDERSCORE}}");

export const MODULE_ID = Lexer.createToken(
	"MODULE_ID",
	createPattern("({{UPPER_CASE}}({{LOWER_CASE}}|{{DIGIT}})*)+")
);
export const DEFAULT_ID = Lexer.createToken(
	"DEFAULT_ID",
	createPattern("{{ID}}({{ID}}|{{DIGIT}})*")
);

export const IDENTIFIER_TOKENS = [MODULE_ID, DEFAULT_ID];
