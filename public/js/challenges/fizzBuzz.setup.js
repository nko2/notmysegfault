exports.setup = function() {
	var results = [];

	function printValue(msg) {
		results.push(msg);
	}

	// Make print function global
	window.write = printValue;

	return {
		results: results
	};
};

exports.initialValue = function() {
	return "// Example: write('FizzBuzz')";
};
