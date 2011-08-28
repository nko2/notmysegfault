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
			if (a.get('state') === 'fighting') {
				return 1;
			} else if (b.get('state') === 'fighting'){
				return -1;
			} else {
				return b.id - a.id;
			}
		}
	}))([]),
	battleListView = new (Backbone.View.extend({
		view: Backbone.View.extend({
			tagName: 'li',
			template: $.template('<a{{if state === "waiting"}} href="/${id}"{{/if}}><ul class="userList inlineList">{{each users}}<li>${$value.login}</li>{{/each}}</ul>{{if state === \'fighting\'}} (battling now){{/if}}</a>'),
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
			var $el = $(this.el), $footer = $el.children('.footer:first');
			$el.children(':not(.footer)').remove();
			this.collection.each(function(model){
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