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
    time: 10,
    going: false
  },
  initialize: function() {
    this.on('change:time', function() {
      console.log("Countdownconfig changed");
      if (this.attributes.time) {
        this.attributes.going = false;
      }
    });
  },
  dec: function() {
    this.attributes.time--;
    return console.log("CountDownConfig decrement, now: " + this.attributes.time);
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
    eventTransfer.on('onGoingchanged', this.onGoing, this);
  },
  onTomatoClicked: function(data) {
    this.$el.find("input").val(data.title);
  },
  onGoing: function(data) {
    this.$el.find(".button").toggleClass("disabled", data.going);
    return this.$el.find("input").attr("disabled", data.going);
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
    this.listenTo(this.model, "change", this.render);
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
    if (this.model.get("done")) {
      this.$el.find(".ckbox-label").attr("class", "ckbox-label checked");
    } else {
      this.$el.find(".ckbox-label").attr("class", "ckbox-label");
    }
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
    eventTransfer.on('receiveTime', this.change, this);
    eventTransfer.on('onGoingchanged', this.onGoing, this);
  },
  pad: function(num, n) {
    var len;
    len = num.toString().length;
    while (len < n) {
      num = "0" + num;
      len++;
    }
    return num;
  },
  change: function(data) {
    var duration, min, sec;
    duration = data.time;
    min = Math.floor(duration / 60);
    sec = duration % 60;
    console.log("duration:" + duration);
    console.log("min:" + min);
    console.log("sec:" + sec);
    min = this.pad(min, 2);
    sec = this.pad(sec, 2);
    return this.$el.html(min + ":" + sec);
  },
  onGoing: function(data) {
    if (!data.going) {
      return this.$el.html("02:00");
    }
  }
});

AppView = Backbone.View.extend({
  el: $("#container"),
  initialize: function() {
    this.potatoList = this.$("#seg-potato");
    this.tomatoList = this.$("#seg-tomato");
    this.inputPotato = this.$("#input-potato");
    this.inputTomato = this.$("#input-tomato");
    this.btnStart = this.$("#input-potato .button");
    this.btnAddPlan = this.$("#input-tomato .button");
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
      duration: 120,
      going: false,
      time: 120
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
    this.listenTo(this.potatos, 'reset', this.addAllPotato);
    this.listenTo(this.potatos, 'all', this.render);
    this.listenTo(this.tomatos, 'reset', this.addAllTomato);
    this.listenTo(this.tomatos, 'all', this.render);
    return eventTransfer.on('addOnePotato', this.addOnePotato, this);
  },
  events: {
    "click #input-potato .button": "addPotato",
    "click #input-tomato .button": "addTomato"
  },
  addPotato: function() {
    var newpotato, title;
    title = $("#input-potato input").val();
    newpotato = new PotatoModel({
      'title': title
    });
    if (newpotato.isValid()) {
      this.countDownConfig.set('going', true);
      this.countDownConfig.set('time', this.countDownConfig.get('duration'));
      console.log("Starting potato Going: " + this.countDownConfig.get("going"));
      console.log(" Duration" + this.countDownConfig.get('time'));
      eventTransfer.trigger('onGoingchanged', {
        'going': true
      });
      this.startCountDown(this.countDownConfig);
    }
  },
  addOnePotato: function() {
    var newpotato, title;
    title = $("#input-potato input").val();
    newpotato = new PotatoModel({
      'title': title
    });
    this.potatos.add(newpotato);
  },
  startCountDown: function(cdConfig) {
    var decrement;
    decrement = function() {
      if (cdConfig.get("time")) {
        cdConfig.dec();
        setTimeout(decrement, 1000);
        eventTransfer.trigger('receiveTime', {
          'time': cdConfig.get("time")
        });
        eventTransfer.trigger('onGoingchanged', {
          'going': true
        });
      } else {
        cdConfig.set("going", false);
        eventTransfer.trigger('onGoingchanged', {
          'going': false
        });
        eventTransfer.trigger('addOnePotato');
        eventTransfer.trigger('resetCountDown');
      }
    };
    return decrement();
  },
  addTomato: function() {
    var newTomato, title;
    title = $("#input-tomato input").val();
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
