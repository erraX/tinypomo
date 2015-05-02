/*global $, Backbone*/
var PotatoCollection = Backbone.Collection.extend({
  model: PotatoModel,

  localStorage: new Backbone.LocalStorage("tinypomo"),
});

var TomatoCollection = Backbone.Collection.extend({
  model: TomatoModel,
  localStorage: new Backbone.LocalStorage("tinypomo"),

  done: function() {
    return this.where({done:true});
  },

  remaining: function() {
    return this.where({done: false});
  },
});
