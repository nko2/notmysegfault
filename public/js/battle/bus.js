define('battle/bus', function() {
	function Bus() {
		this.subs = {};
	}

	Bus.prototype.sub = function(topic, fn) {
		var topicSubs = (this.subs[topic] = this.subs[topic] || []);

		topicSubs.push(fn);

		return function() {
			var index = topicSubs.indexOf(fn);

			if (index >= 0) {
				topicSubs.splice(index, 1);
			}
		};
	};

	Bus.prototype.pub = function(topic, data) {
		var subs = this.subs,
			topicSubs = subs[topic] || [];

		topicSubs.forEach(function(sub) {
			sub.call(null, data);
		});
	};

	return Bus;
});
