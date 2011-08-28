var battles = new (Backbone.Collection.extend({
		initialize: function(){
			this.bind('change', function(){
				this.sort();
			}, this);
		},
		sortedIndex: function(candidate, comparator){
			var i = 0;
			while (i < this.models.length && comparator(this.models[i], candidate) <= 0) {
				i++;
			}
			return i;
		},
		sortBy: function(comparator){
			return this.models.sort(comparator);
		},
		comparator: function(a, b){
			var aFighting = a.get('state') === 'fighting', bFighting = b.get('state') === 'fighting';
			if (aFighting && ! bFighting) {
				return -1;
			} else if (bFighting && ! aFighting){
				return 1;
			} else {
				return b.id - a.id;
			}
		}
	}))([]),
	battleListView = new (Backbone.View.extend({
		view: Backbone.View.extend({
			tagName: 'li',
			template: $.template($('#battle-tmpl').text()),
			initialize: function(){
				this.el.className = 'battle';
				this.render();
				this.model.bind('change', this.render, this);
			},
			render: function(){
				$(this.el).html($.tmpl(this.template, this.model.toJSON(), this.templateOptions));
			},
			destroy: function(){
				$(this.el).remove();
			},
		}),
		el: document.getElementById('openbattles'),
		initialize: function(){
			this.collection.bind('all', this.render, this);
			this.render();
		},
		render: function(){
			var $el = $(this.el), $footer = $el.children('.footer:first'), items;
			items = this.collection.toArray().sort(function(model) {
				return model.get('state').trim() === 'waiting' ? -1 : 1;
			});
			$el.children(':not(.footer)').remove();
			items.forEach(function(model){
				$((new this.view({ model: model })).el).insertBefore($footer);
			}, this);
		}
	}))({ collection: battles });
io.connect('/lobby')
	.on('refresh', function(newBattles){
		console.log('refresh', newBattles);
		battles.reset(newBattles);
	})
	.on('update', function(battleUpdate){
		console.log('update', battleUpdate);
		var battle = battles.get(battleUpdate.id);
		if (battle) {
			battle.set(battleUpdate);
		}
	})
	.on('add', function(battle){
		console.log('add', battle);
		battles.add(battle);
	})
	.on('destroy', function(battleId){
		console.log('destroy', battleId);
		var battle = battles.get(battleId);
		if (battle) {
			battles.remove(battle);
		}
	});
