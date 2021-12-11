import { readFileSync } from "fs";

import { generateTokens, tokens } from "@modules/lexer";
import { parse } from "@modules/parser";
import { logErrors, logTree } from "@utils/log";

const fileName = `${process.cwd()}/examples/fizz_buzz.dk`;
const fileBuffer = readFileSync(fileName);
const file = Buffer.from(fileBuffer).toString();

const lexerResult = generateTokens(file, tokens);
const parseResult = parse(lexerResult.tokens);

logTree(parseResult.tree);
logErrors(lexerResult.errors, parseResult.errors);
