import { readFileSync } from "fs";

import { Lexer, tokens } from "@modules/Lexer";
import { Parser } from "@modules/Parser";
import { logTree } from "@utils/log";

const fileBuffer = readFileSync(`${process.cwd()}/examples/fizz_buzz.dk`);

const file = Buffer.from(fileBuffer).toString();

const lexerResult = Lexer.parse(tokens, file);

const parser = new Parser();

parser.input = lexerResult.tokens;

const parserTree = parser.init();

logTree(parserTree);

console.group("\n\n---------- Errors ----------\n\n");
console.log("Parse\n");
console.warn(parser.errors);
console.log("\nLexer\n");
console.warn(lexerResult.errors);
console.groupEnd();
