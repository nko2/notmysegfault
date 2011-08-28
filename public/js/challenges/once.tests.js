exports['once should return a function'] = function(test) {
	var result = typeof once(function() {});
	test.equal(result, 'function', 'Expected result of once to a function but it seems to be ' + result + '.');
	test.done();
};

exports['once should call the original function'] = function(test) {
	var called = false,
		o = once(function() { called = true })();
	
	test.ok(called, 'Expected the original function to have been called');
	test.done();
};

exports['should pass through all the arguments from the original function'] = function(test) {
	var testArgs = ['foo', 'bar'],
		slice = ([]).slice,
		resultArgs,
		o = once(function() {
			resultArgs = slice.call(arguments, 0);
		}),
		passed = true;
		
	o.apply(null, testArgs);
	
	testArgs.forEach(function(arg, index) {
		var actual = resultArgs[index];
		passed = passed && actual == arg;
		return passed;
	});
	
	test.ok(passed, "Expected to be called with (" + testArgs.toString() + '), but was called with (' + resultArgs.toString() + ').');
	test.done();
};

exports['should call original in the context of the caller'] = function(test) {
	var expectedContext = { test: 'hello' },
		actualContext,
		o = once(function() { actualContext = this; });
		
	o.call(expectedContext);
	
	test.strictEqual(actualContext, expectedContext);
	test.done();
};

exports['should return value from original'] = function(test) {
	var expectedReturn = { test: 'hello' },
		actualReturn,
		o = once(function() { return expectedReturn });
		
	actualReturn = o();
	
	test.strictEqual(actualReturn, expectedReturn);
	test.done();
};

exports['should once call original once'] = function(test) {
	var callCount = 0,
		o = once(function() { callCount++; });
		
	o();
	o();
	o();
	o();
	
	test.equal(callCount, 1, "Original should have been called once but was invokved " + callCount + " times.");
	test.done();
};

exports['should always return the original value'] = function(test) {
	var first = true,
		possibleReturns = [ 'foo', 'bar', 'monkey nuts'],
		returnValue,
		actualReturn,
		o = once(function() { 
			// Store the first value
			var resultIndex = Math.floor(possibleReturns.length * Math.random()),
				result = possibleReturns[resultIndex];
			
			if (first) {
				returnValue = result;
				possibleReturns.splice(resultIndex, 1);
				first = false;
			}
			
			return result;
		});
		
	o();
	o();
	o();
	actualReturn = o();
	
	test.equal(actualReturn, returnValue, "Expected the returned function to always return the original value (" + returnValue + "), but got " + actualReturn + ".")
	
	test.done();
};