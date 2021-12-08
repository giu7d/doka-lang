import { CstParser, ILexingResult, EOF } from "chevrotain";

import { tokens } from "@modules/Lexer";

import {
	MODULE,
	EOL,
	FUNCTION,
	EXIT,
	PARAMS_START,
	PARAMS_END,
	BLOCK_START,
	BLOCK_END,
	IF,
} from "@modules/Lexer/components/BlockTokens";

import {
	DEFAULT_ID,
	MODULE_ID,
} from "@modules/Lexer/components/IdentifierTokens";

import {
	BOOLEAN,
	COMMA,
	NUMBER,
	STRING,
} from "@modules/Lexer/components/DataTokens";

import {
	ADD,
	AND,
	ASSIGN_RETURN,
	DIFFERENT,
	DIVIDE,
	EQUAL,
	GREATER,
	GREATER_OR_EQUAL,
	MOD,
	MULTIPLY,
	OR,
	SMALLER,
	SMALLER_OR_EQUAL,
	SUBTRACT,
} from "@modules/Lexer/components/OperatorTokens";

export class Parser extends CstParser {
	constructor() {
		super(tokens, {
			maxLookahead: 1,
		});
		this.performSelfAnalysis();
	}

	static parse(result: ILexingResult) {
		const parser = new Parser();

		parser.input = result.tokens;

		return parser.init();
	}

	public init = this.RULE("init", () => {
		this.SUBRULE(this.ignoreEOL);
		this.SUBRULE(this.declareModule);
	});

	/**
	 *	@name declareModule
	 *	@example
	 * 		module ModuleId
	 * 			<blockScope>
	 * 		<EOF>
	 */
	private declareModule = this.RULE("declareModule", () => {
		this.CONSUME(MODULE);
		this.CONSUME(MODULE_ID);
		this.SUBRULE(this.requireEOL);
		this.SUBRULE(this.blockScope);
		this.SUBRULE(this.requireEOF);
	});

	/**
	 *	@name declareFunction
	 *	@example
	 * 		fun function_id(params):
	 * 			<functionBlockScope>
	 * 		end
	 */
	private declareFunction = this.RULE("declareFunction", () => {
		this.CONSUME(FUNCTION);
		this.CONSUME(DEFAULT_ID);
		this.SUBRULE(this.functionParamsScope);
		this.CONSUME(BLOCK_START);
		this.SUBRULE(this.functionBlockScope);
		this.CONSUME(BLOCK_END);
	});

	/**
	 *	@name functionBlockScope
	 *	@example
	 * 		// fun function_id(params):
	 * 			<blockScope>
	 * 			<- <declareExpData>
	 * 		// end
	 *
	 *	@example
	 * 		// fun function_id(params):
	 * 			<blockScope>
	 * 			case:
	 * 				(expr) -> <declareExpData>
	 * 				_ -> <declareExpData> // default
	 * 			end
	 * 		// end
	 */
	private functionBlockScope = this.RULE("functionBlockScope", () => {
		this.SUBRULE(this.blockScope);
		this.OR([
			{ ALT: () => this.SUBRULE(this.declareCondition) },
			{ ALT: () => this.SUBRULE(this.declareReturn) },
		]);
		this.SUBRULE(this.ignoreEOL);
	});

	/**
	 *	@name functionParamsScope
	 *	@example
	 * 		(params_1, params_2, params_n)
	 */
	private functionParamsScope = this.RULE("functionParamsScope", () => {
		this.CONSUME(PARAMS_START);
		this.MANY_SEP({
			DEF: () => this.CONSUME(DEFAULT_ID),
			SEP: COMMA,
		});
		this.CONSUME(PARAMS_END);
	});

	/**
	 *	@name declareReturn
	 *	@example
	 * 		<- <declareExpData>
	 */
	private declareReturn = this.RULE("declareReturn", () => {
		this.CONSUME(ASSIGN_RETURN);
		this.SUBRULE(this.declareExpData);
		this.SUBRULE(this.ignoreEOL);
	});

	/**
	 *	@name declareCondition
	 *	@example
	 * 		case:
	 * 			(expr) -> <declareExpData>
	 * 			_ -> <declareExpData> // default
	 * 		end
	 */
	private declareCondition = this.RULE("declareCondition", () => {
		this.CONSUME(IF);
		this.SUBRULE(this.expression);
		this.CONSUME(BLOCK_START);
		this.SUBRULE(this.functionBlockScope);
		this.CONSUME(BLOCK_END);
	});

	/**
	 *	@name declareList
	 *	@example
	 * 		[item_1, item_2, item_n]
	 *
	 */
	private declareList = this.RULE("declareList", () => {
		this.CONSUME(BLOCK_START);
		this.MANY_SEP({
			DEF: () => this.SUBRULE(this.declareData),
			SEP: COMMA,
		});
		this.CONSUME(BLOCK_END);
	});

	/**
	 *	@name declareData
	 *	@example
	 *		"string"
	 *		0.00
	 *		true
	 *		false
	 *		a
	 *		a()
	 *		[]
	 */
	private declareData = this.RULE("declareData", () => {
		this.OR([
			{ ALT: () => this.CONSUME(STRING) },
			{ ALT: () => this.CONSUME(NUMBER) },
			{ ALT: () => this.CONSUME(BOOLEAN) },
			{ ALT: () => this.SUBRULE(this.declareCallable) },
			{ ALT: () => this.SUBRULE(this.declareList) },
		]);
	});

	/**
	 *	@name declareCallable
	 *	@example
	 *		a
	 *		a()
	 *		a()()
	 */
	private declareCallable = this.RULE("declareCallable", () => {
		this.CONSUME(DEFAULT_ID);
		this.MANY({
			DEF: () => this.SUBRULE(this.functionParamsScope),
		});
	});

	/**
	 *	@name expression
	 *	@example
	 *		<data> <MATH_EXP>
	 *		<data> <LOGIC_EXP>
	 */
	private expression = this.RULE("expression", () => {
		this.SUBRULE(this.declareExpData);
		this.OPTION(() =>
			this.OR([
				{ ALT: () => this.SUBRULE(this.mathExpression) },
				{ ALT: () => this.SUBRULE(this.logicalExpression) },
			])
		);
	});

	private mathExpression = this.RULE("mathExpression", () => {
		this.SUBRULE(this.mathOperation);
		this.SUBRULE(this.declareExpData);
	});

	private logicalExpression = this.RULE("logicalExpression", () => {
		this.SUBRULE(this.logicOperation);
		this.SUBRULE(this.declareExpData);
	});

	private priorityExpression = this.RULE("priorityExpression", () => {
		this.CONSUME(PARAMS_START);
		this.SUBRULE(this.expression);
		this.CONSUME(PARAMS_END);
	});

	private declareExpData = this.RULE("declareExpData", () => {
		this.OR([
			{ ALT: () => this.CONSUME(NUMBER) },
			{ ALT: () => this.CONSUME(BOOLEAN) },
			{ ALT: () => this.SUBRULE(this.declareCallable) },
			{ ALT: () => this.SUBRULE(this.priorityExpression) },
		]);
	});

	/**
	 *	@name mathOperation
	 */
	private mathOperation = this.RULE("mathOperation", () => {
		this.OR([
			{ ALT: () => this.CONSUME(ADD) },
			{ ALT: () => this.CONSUME(SUBTRACT) },
			{ ALT: () => this.CONSUME(MULTIPLY) },
			{ ALT: () => this.CONSUME(DIVIDE) },
			{ ALT: () => this.CONSUME(MOD) },
		]);
	});

	/**
	 *	@name logicOperation
	 */
	private logicOperation = this.RULE("logicOperation", () => {
		this.OR([
			{ ALT: () => this.CONSUME(AND) },
			{ ALT: () => this.CONSUME(OR) },
			{ ALT: () => this.CONSUME(GREATER) },
			{ ALT: () => this.CONSUME(SMALLER) },
			{ ALT: () => this.CONSUME(GREATER_OR_EQUAL) },
			{ ALT: () => this.CONSUME(SMALLER_OR_EQUAL) },
			{ ALT: () => this.CONSUME(DIFFERENT) },
			{ ALT: () => this.CONSUME(EQUAL) },
		]);
	});

	// Block
	private blockScope = this.RULE("blockScope", () => {
		this.MANY({
			DEF: () =>
				this.OR([
					{ ALT: () => this.SUBRULE(this.declareFunction) },
					{ ALT: () => this.SUBRULE(this.declareData) },
					{ ALT: () => this.SUBRULE(this.ignoreEOL) },
				]),
		});
	});

	// EOL
	private ignoreEOL = this.RULE("ignoreEOL", () =>
		this.MANY({ DEF: () => this.CONSUME(EOL) })
	);

	private requireEOL = this.RULE("requireEOL", () =>
		this.AT_LEAST_ONE({ DEF: () => this.CONSUME(EOL) })
	);

	// EOF
	private requireEOF = this.RULE("requireEOF", () => {
		this.OR([
			{ ALT: () => this.CONSUME(EOF) },
			{ ALT: () => this.CONSUME(EXIT) },
		]);
	});
}
