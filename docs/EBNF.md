```
	MODULE 			::= 'module'
	EXIT 			::= 'exit'
	EOL 			::= '\n\r' | '\r' | '\n'
	FUNCTION		::= 'fun'
	PARAMS_START	::= '('
	PARAMS_END		::= ')'
	COMMA			::= ','
	BLOCK_START		::= ':'
	BLOCK_END		::= 'end'
	CASE			::= 'case'
	AND				::= '&&'
	OR				::= 'OR'

	<!-- EQUAL: /\=\=/,
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
	SKIP: /\s|\t/, -->
```

```
Init ::= IgnoreEOL DeclareModule

DeclareModule ::= 'module' 'moduleId' RequireEOL ModuleBlockScope RequireEOF

ModuleBlockScope ::= (DeclareFunction | DeclareExpression | IgnoreEOL)*

DeclareFunction ::= 'fun' 'id' FunctionParamsScope ':' FunctionBlockScope 'end'

FunctionBlockScope ::= ModuleBlockScope (DeclareCondition | DeclareReturn) IgnoreEOF

FunctionParamsScope ::= '(' ('id' ',')* 'id'  ')'

DeclareReturn ::= '<-' DeclareExpression IgnoreEOL


DeclareCondition ::= 'case'


DeclareExpression

IgnoreEOL

RequireEOL

RequireEOF

```
