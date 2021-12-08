import { readFileSync } from "fs";
import { tokens } from "@modules/Lexer";
import { Lexer } from "@modules/Lexer/service/ChevrotainLexer";
// import { Parser } from "@modules/Parser";
import { logTree } from "@utils/log";

const fileBuffer = readFileSync(`${process.cwd()}/examples/example.dk`);

const file = Buffer.from(fileBuffer).toString("utf-8");

const lexerResult = Lexer.parse(tokens, file);

// const parserTree = Parser.parse(lexerResult);

logTree(lexerResult);
