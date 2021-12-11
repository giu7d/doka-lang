export function logTree(cst: any, indentation = 0) {
	if (!cst) {
		return;
	}

	if (!cst.children) {
		return;
	}

	const { children = {} } = cst;
	const childrenKeys = Object.keys(children);
	const currentIndentation = indentation + 1;

	return childrenKeys.map((key) => {
		if (!children[key]) return;

		console.log(`${Array(currentIndentation).fill(" ").join("|")}${key}`);

		return children[key]?.map((e: any) => logTree(e, currentIndentation));
	});
}

export function logErrors(lexerResultErrors: any, parseResultErrors: any) {
	console.group("\n\n---------- Errors ----------\n\n");
	console.log("\nLexer\n");
	console.warn(lexerResultErrors);
	console.log("\nParse\n");
	console.warn(parseResultErrors);
	console.groupEnd();
}
