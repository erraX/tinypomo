/*global $,Backbone,alert */

var PotatoModel = Backbone.Model.extend({
  default: {
    title: "",
  },

  validate: function(attr) {
    if (!attr.title) {
      alert("请输入接下来准备做的事？");
      return "error";
    }
  }
});

var TomatoModel = Backbone.Model.extend({
  default: {
    title: "",
    done: false
  },

  validate: function(attr) {
    if (!attr.title) {
      alert("请输入你想要做的任务");
      return "error";
    }
  },

  toggle: function() {
    this.save({done: !this.get("done")});
  }
});

var CountDownConfig = Backbone.Model.extend({
  default: {
    duration: 10,
    going: false,
  },

  initialize: function() {
    this.on('change:duration', function() {
      if (this.duration) {
        this.going = false;
      }
    });
  }
});

var InputField = Backbone.Model.extend();
