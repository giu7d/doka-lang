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
	CASE,
} from "@modules/Lexer/components/BlockTokens";

import {
	DEFAULT_ID,
	MODULE_ID,
} from "@modules/Lexer/components/IdentifierTokens";

import {
	BOOLEAN,
	COMMA,
	LIST_END,
	LIST_START,
	NULL,
	NUMBER,
	STRING,
} from "@modules/Lexer/components/DataTokens";

import {
	ADD,
	AND,
	ASSIGN_FUNCTION,
	ASSIGN_RETURN,
	DIFFERENT,
	DIVIDE,
	EQUAL,
	GREATER,
	GREATER_OR_EQUAL,
	MOD,
	MULTIPLY,
	OR,
	UNDERSCORE,
	SMALLER,
	SMALLER_OR_EQUAL,
	SUBTRACT,
} from "@modules/Lexer/components/OperatorTokens";

export class Parser extends CstParser {
	constructor() {
		super(tokens, {
			maxLookahead: 1,
			recoveryEnabled: true,
		});
		this.performSelfAnalysis();
	}

	public init = this.RULE("init", () => {
		this.SUBRULE(this.ignoreEOL);
		this.SUBRULE(this.declareModule);
	});

	/**
	 *	@name declareModule
	 *	@example
	 * 		module ModuleId
	 * 			<moduleBlockScope>
	 * 		<EOF>
	 */
	private declareModule = this.RULE("declareModule", () => {
		this.CONSUME(MODULE);
		this.CONSUME(MODULE_ID);
		this.SUBRULE(this.requireEOL);
		this.SUBRULE(this.moduleBlockScope);
		this.SUBRULE(this.requireEOF);
	});

	private moduleBlockScope = this.RULE("moduleBlockScope", () => {
		this.MANY({
			DEF: () =>
				this.OR([
					{ ALT: () => this.SUBRULE(this.declareFunction) },
					{ ALT: () => this.SUBRULE(this.declareExpression) },
					{ ALT: () => this.SUBRULE(this.ignoreEOL) },
				]),
		});
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
	 * 			<moduleBlockScope>
	 * 			<- <declareData>
	 * 		// end
	 *
	 *	@example
	 * 		// fun function_id(params):
	 * 			<moduleBlockScope>
	 * 			case:
	 * 				(expr) -> <declareData>
	 * 				_ -> <declareData> // default
	 * 			end
	 * 		// end
	 */
	private functionBlockScope = this.RULE("functionBlockScope", () => {
		this.SUBRULE(this.moduleBlockScope);
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
	 * 		<- <declareExpression>
	 */
	private declareReturn = this.RULE("declareReturn", () => {
		this.CONSUME(ASSIGN_RETURN);
		this.SUBRULE(this.declareExpression);
		this.SUBRULE(this.ignoreEOL);
	});

	/**
	 *	@name declareCondition
	 *	@example
	 * 		case:
	 * 			<conditionBlockScope>
	 * 			<defaultConditionBlockScope>
	 * 		end
	 */
	private declareCondition = this.RULE("declareCondition", () => {
		this.CONSUME(CASE);
		this.CONSUME(BLOCK_START);
		this.SUBRULE(this.ignoreEOL);
		this.MANY({
			DEF: () => this.SUBRULE(this.conditionBlockScope),
		});
		this.SUBRULE(this.defaultConditionBlockScope);
		this.CONSUME(BLOCK_END);
	});

	/**
	 *	@name conditionBlockScope
	 *	@example
	 * 		(declareExpression) -> <returnBlockScope>
	 */
	private conditionBlockScope = this.RULE("conditionBlockScope", () => {
		this.SUBRULE(this.declareExpression);
		this.CONSUME(ASSIGN_FUNCTION);
		this.SUBRULE(this.returnBlockScope);
	});

	/**
	 *	@name defaultConditionBlockScope
	 *	@example
	 * 		_ -> <returnBlockScope>
	 */
	private defaultConditionBlockScope = this.RULE(
		"defaultConditionBlockScope",
		() => {
			this.CONSUME(UNDERSCORE);
			this.CONSUME(ASSIGN_FUNCTION);
			this.SUBRULE(this.returnBlockScope);
		}
	);

	/**
	 *	@name defaultConditionBlockScope
	 *	@example
	 * 		<returnBlockScope><EOL>
	 */
	private returnBlockScope = this.RULE("returnBlockScope", () => {
		this.SUBRULE(this.declareExpression);
		this.SUBRULE(this.requireEOL);
	});

	/**
	 *	@name declareList
	 *	@example
	 * 		[item_1, item_2, item_n]
	 *
	 */
	private declareList = this.RULE("declareList", () => {
		this.CONSUME(LIST_START);
		this.MANY_SEP({
			DEF: () => this.SUBRULE(this.declareExpression),
			SEP: COMMA,
		});
		this.CONSUME(LIST_END);
	});

	/**
	 *	@name declareData
	 */
	private declareData = this.RULE("declareData", () => {
		this.OR([
			{ ALT: () => this.CONSUME(NULL) },
			{ ALT: () => this.CONSUME(STRING) },
			{ ALT: () => this.CONSUME(NUMBER) },
			{ ALT: () => this.CONSUME(BOOLEAN) },
			{ ALT: () => this.SUBRULE(this.declareList) },
			{ ALT: () => this.SUBRULE(this.declareCallable) },
			{ ALT: () => this.SUBRULE(this.priorityExpression) },
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
	 *	@name declareExpression
	 */
	private declareExpression = this.RULE("declareExpression", () => {
		this.SUBRULE(this.declareData);
		this.OPTION(() =>
			this.OR([
				{ ALT: () => this.SUBRULE(this.mathExpression) },
				{ ALT: () => this.SUBRULE(this.logicalExpression) },
			])
		);
	});

	/**
	 *	@name mathExpression
	 *	@example
	 *		<MATH_OP> <declareExpression>
	 */
	private mathExpression = this.RULE("mathExpression", () => {
		this.SUBRULE(this.mathOperation);
		this.SUBRULE(this.declareExpression);
	});

	/**
	 *	@name mathExpression
	 *	@example
	 *		<LOGIC_OP> <declareExpression>
	 */
	private logicalExpression = this.RULE("logicalExpression", () => {
		this.SUBRULE(this.logicOperation);
		this.SUBRULE(this.declareExpression);
	});

	/**
	 *	@name priorityExpression
	 *	@example
	 *		( <declareExpression> )
	 */
	private priorityExpression = this.RULE("priorityExpression", () => {
		this.CONSUME(PARAMS_START);
		this.SUBRULE(this.declareExpression);
		this.CONSUME(PARAMS_END);
	});

	/**
	 *	@name mathOperation
	 *	@example
	 *		- + * / %
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
	 *	@example
	 *		&& || < > <= >= != ==
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
