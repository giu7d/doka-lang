import { Lexer } from "@modules/Lexer/service/ChevrotainLexer";

export const SKIP = Lexer.createToken("SKIP", /\s|\t/, true);

export const SKIP_TOKENS = [SKIP];
