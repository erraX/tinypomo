var AppView, CountDownConfig, InputField, InputFieldView, PotatoCollection, PotatoListView, PotatoModel, PotatoView, TimeCountDown, TomatoCollection, TomatoListView, TomatoModel, TomatoView, eventTransfer, pad;

PotatoModel = Backbone.Model.extend({
  "default": {
    title: ""
  },
  validate: function(attr) {
    if (!attr.title) {
      alert("请输入接下来准备做的事");
      return "error";
    }
  }
});

TomatoModel = Backbone.Model.extend({
  "default": {
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
    this.save({
      done: !this.get("done")
    });
  }
});

CountDownConfig = Backbone.Model.extend({
  "default": {
    duration: 10,
    going: false
  },
  initialize: function() {
    this.on('change:duration', function() {
      if (this.duration) {
        this.going = false;
      }
    });
  }
});

InputField = Backbone.Model.extend();

PotatoCollection = Backbone.Collection.extend({
  model: PotatoModel,
  localStorage: new Backbone.LocalStorage("tinypomo")
});

TomatoCollection = Backbone.Collection.extend({
  model: TomatoModel,
  localStorage: new Backbone.LocalStorage("tinypomo"),
  done: function() {
    return this.where({
      done: true
    });
  },
  remaining: function() {
    return this.where({
      done: false
    });
  }
});

eventTransfer = _.extend({}, Backbone.Events);

InputFieldView = Backbone.View.extend({
  initialize: function() {
    eventTransfer.on('tomatoClicked', this.onTomatoClicked, this);
  },
  onTomatoClicked: function(data) {
    this.$el.val(data.title);
  },
  render: function() {
    this.$el.val(this.model.get("title"));
  }
});

PotatoView = Backbone.View.extend({
  tagname: "div",
  className: "item",
  initialize: function() {
    this.template = _.template($("#potatoItem").html());
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

PotatoListView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, "add", this.render);
    this.listenTo(this.model, "change", this.render);
    return this.listenTo(this.model, "remove", this.render);
  },
  render: function() {
    var i, j, len1, m, ref, view;
    this.$el.html("");
    ref = this.model;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      m = ref[i];
      view = new PotatoView({
        model: this.model.at(i)
      });
      this.$el.append(view.$el);
      view.render();
    }
    return this;
  }
});

TomatoView = Backbone.View.extend({
  tagname: "div",
  className: "item",
  initialize: function() {
    this.template = _.template($("#tomatoItem").html());
  },
  events: {
    "click .ckbox-label": "addToPotatoInputField",
    "click .ui.checkbox": "toggleDone"
  },
  addToPotatoInputField: function() {
    var title;
    title = this.$el.find(".ckbox-label").html();
    eventTransfer.trigger('tomatoClicked', {
      'title': title
    });
  },
  toggleDone: function() {
    this.model.toggle();
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.$el.find(".ui.checkbox").checkbox(this.model.get("done") ? 'check' : 'uncheck');
    return this;
  }
});

TomatoListView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, "add", this.render);
    this.listenTo(this.model, "remove", this.render);
  },
  render: function() {
    var i, j, len1, m, ref, self, view;
    this.$el.html("");
    self = this;
    ref = this.model;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      m = ref[i];
      view = new TomatoView({
        model: this.model.at(i)
      });
      this.$el.append(view.$el);
      view.render();
    }
    return this;
  }
});

TimeCountDown = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {}
});

AppView = Backbone.View.extend({
  el: $("#container"),
  initialize: function() {
    this.potatoList = this.$("#seg-potato");
    this.tomatoList = this.$("#seg-tomato");
    this.inputPotato = this.$("#input-potato");
    this.inputTomato = this.$("#input-tomato");
    this.btnStart = this.$("#btn-addPotato");
    this.btnAddPlan = this.$("#btn-addTomato");
    this.countDown = this.$("#countdown");
    this.potatos = new PotatoCollection([
      {
        "title": "potato1"
      }
    ]);
    this.tomatos = new TomatoCollection([
      {
        "title": "tomato1",
        done: false
      }, {
        title: "tomato2",
        done: true
      }
    ]);
    this.countDownConfig = new CountDownConfig({
      duration: 10,
      going: false
    });
    this.potatoInput = new InputField({
      "title": ""
    });
    this.viewPotato = new PotatoListView({
      el: this.potatoList,
      model: this.potatos
    });
    this.viewTomato = new TomatoListView({
      el: this.tomatoList,
      model: this.tomatos
    });
    this.viewCountDown = new TimeCountDown({
      el: this.countDown,
      model: this.countDownConfig
    });
    this.viewPotatoInputField = new InputFieldView({
      el: this.inputPotato,
      model: this.potatoInput
    });
    this.viewPotato.render();
    this.viewTomato.render();
    this.viewCountDown.render();
    this.viewPotatoInputField.render();
    this.listenTo(this.potatos, 'add', this.addOnePotato);
    this.listenTo(this.potatos, 'reset', this.addAllPotato);
    this.listenTo(this.potatos, 'all', this.render);
    this.listenTo(this.tomatos, 'add', this.addOneTomato);
    this.listenTo(this.tomatos, 'reset', this.addAllTomato);
    return this.listenTo(this.tomatos, 'all', this.render);
  },
  events: {
    "click #btn-addPotato": "addPotato",
    "click #btn-addTomato": "addTomato"
  },
  toggleStatus: function() {
    this.btnStart.toggleClass("disabled", this.model.get('done'));
    $("#input-todo").attr("disabled", countDownConfig.get("starting"));
  },
  addPotato: function() {
    var newpotato, title;
    title = $("#input-potato").val();
    newpotato = new PotatoModel({
      'title': title
    });
    if (newpotato.isValid()) {
      return this.potatos.add(newpotato);
    }
  },
  addTomato: function() {
    var newTomato, title;
    title = $("#input-tomato").val();
    newTomato = new TomatoModel({
      'title': title
    });
    if (newTomato.isValid()) {
      return this.tomatos.add(newTomato);
    }
  }
});

pad = function(num, n) {
  var len;
  len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
};

$.fn.countdown = function(callback, duration) {
  var countdown, min, sec;
  duration--;
  min = Math.floor(duration / 61);
  sec = duration % 60 || 59;
  return countdown = setInterval(function() {
    console.log("sec:" + sec + ", duration:" + duration);
    $("time").html(pad(min, 2));
    if (duration) {
      sec--;
      if (sec === -1) {
        min--;
        sec = 59;
      }
      return duration--;
    } else {
      clearInterval(countdown);
      callback.call();
    }
  }, 1000);
};

$(function() {
  var app;
  app = new AppView();
});
