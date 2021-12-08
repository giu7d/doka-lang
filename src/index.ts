import { readFileSync } from "fs";

import { Lexer, tokens } from "@modules/Lexer";
import { Parser } from "@modules/Parser";
import { logTree } from "@utils/log";

const fileBuffer = readFileSync(`${process.cwd()}/examples/fizz_buzz.dk`);

const file = Buffer.from(fileBuffer).toString();

const lexerResult = Lexer.parse(tokens, file);

const parserTree = Parser.parse(lexerResult);

logTree(parserTree);
