exports.setup = function() {
	var results = [];

	function print(msg) {
		results.push(msg);
	}

	// Make print function global
	window.print = print;

	return {
		results: results
	};
};

exports.initialValue = function() {
	return "// Example: print('FizzBuzz')";
};
