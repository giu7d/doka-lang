# DOKA Language

## How to use

1. Install node dependencies

```
yarn
```

2. Start the compiler

```
yarn start
```

## Features

More examples on the language use can be found in the `examples` folder.

### Modules

Modules allow the use of other modules, assignments, and functions.

```
module ModuleName

```

### Functions

1. Function with simple return:

```
always_return = true

fun function_name(params):
	<- always_return	# required
end
```

2. Function with conditional return:

```
first_return = true
second_return = true
default_return = true

fun function_name(params):
	case:
		(params == Nil) -> first_return
		(params != true) -> [first_return, second_return]
		_ -> default_return		# required
	end
end
```

## Formal Specifications

`TO DO`
