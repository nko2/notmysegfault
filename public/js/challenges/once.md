# Once
Creates a function called `once` that will return a `function`. The first time that the returned function is called it will return the value from the original. Repeated calls to the modified function will have no effect, returning the value from the original call. 

This is particularly useful for initialization functions, instead of having to set a boolean flag and then check it later.

1. `once` returns function.
2. The first time calling the returned function will call through to the original function will all it's arguments and context intact (`this`). It will return the original function's result.
3. Calling the returned function every other time *regardless of arguments or context* will just return the original result without calling the original function.

## Usage
	function add(n1, n2) {
		return n1 + n2;
	}

	var onceAdd = once(add);

	onceAdd(2, 3); // returns 5
	onceAdd(1, 2); // returns 5
	onceAdd(10, 20); // return 5