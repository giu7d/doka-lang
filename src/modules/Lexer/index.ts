import { BLOCK_TOKENS } from "./components/BlockTokens";
import { DATA_TOKENS } from "./components/DataTokens";
import { IDENTIFIER_TOKENS } from "./components/IdentifierTokens";
import { OPERATOR_TOKENS } from "./components/OperatorTokens";
import { SKIP_TOKENS } from "./components/SkipTokens";

export const tokens = [
	...BLOCK_TOKENS,
	...IDENTIFIER_TOKENS,
	...OPERATOR_TOKENS,
	...DATA_TOKENS,
	...SKIP_TOKENS,
];
