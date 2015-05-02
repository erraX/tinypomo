/*global $, _, Backbone, jQuery, alert*/

var eventTransfer = _.extend({}, Backbone.Events);

var InputFieldView = Backbone.View.extend({
  initialize: function() {
    // this.listenTo(this.model, "change", this.render);
    eventTransfer.on('tomatoClicked', this.onTomatoClicked, this);
  },

  onTomatoClicked: function(data) {
    this.$el.val(data.title);
  },

  render: function() {
    this.$el.val(this.model.get("title"));
  },
});

var PotatoView = Backbone.View.extend({
  tagname: "div",
  className: "item",

  initialize: function() {
    this.template = _.template($("#potatoItem").html());
  },

  render: function() {
    // this.$el.html('<div class="title"> <div class="middle-header"><i class="checkmark icon"></i>' + this.model.get("title") + '</div> </div>');
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

var PotatoListView = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.model, "add", this.render);
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "remove", this.render);
  },

  render: function() {
    this.$el.html("");

    for(var i = 0; i < this.model.length; i++) {
      var view = new PotatoView({model: this.model.at(i)});
      this.$el.append(view.$el);
      view.render();
    }
    return this;
  }
});

var TomatoView = Backbone.View.extend({
  tagname: "div",
  className: "item",

  initialize: function() {
    this.template = _.template($("#tomatoItem").html());
  },

  events: {
    "click .ckbox-label": "addToPotatoInputField",
    "click .ui.checkbox": "toggleDone",
  },

  addToPotatoInputField: function() {
    var title = this.$el.find(".ckbox-label").html();
    eventTransfer.trigger('tomatoClicked', { 'title' : title});
  },

  toggleDone: function() {
    this.model.toggle();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    // this.$el.html('<div class="title"> <div class="ui checkbox"><input type="checkbox"></div> <div class="ckbox-label">' + this.model.get("title") + '</div> </div>');
    this.$el.find(".ui.checkbox").checkbox(this.model.get("done")? 'check':'uncheck');
    return this;
  }
});


var TomatoListView = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.model, "add", this.render);
    // 这边不注释的话会导致勾选完成重新渲染页面，还会回到没有勾选的状态
    // this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "remove", this.render);
  },

  render: function() {
    this.$el.html("");
    var self = this;

    for(var i = 0; i < this.model.length; i++) {
      var view = new TomatoView({model: this.model.at(i)});
      this.$el.append(view.$el);
      view.render();
    }
    return this;
  }
});

var TimeCountDown = Backbone.View.extend({
  initialize: function() {
    // console.log(this.model);
    // this.model.on('change', this.render);
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    // 根据duration来重新绘制时间
  } 
});


// 总的程序视图
var AppView = Backbone.View.extend({
  el: $("#container"),

  initialize: function() {
    // _.bindAll(this, "render", "addPotato", "addTomato");
    // 添加网页中已有的元素
    //----------------------------------------------------
    // 土豆和番茄的列表
    this.potatoList = this.$("#seg-potato");
    this.tomatoList = this.$("#seg-tomato");

    // 土豆和番茄的输入框
    this.inputPotato = this.$("#input-potato");
    this.inputTomato = this.$("#input-tomato");

    // 添加土豆和番茄的按钮
    this.btnStart = this.$("#btn-addPotato");
    this.btnAddPlan = this.$("#btn-addTomato");

    // 倒计时表
    this.countDown = this.$("#countdown");

    // 初始化Model
    //----------------------------------------------------
    // 土豆和番茄的列表Model
    this.potatos = new PotatoCollection([{"title": "potato1"}]);
    this.tomatos = new TomatoCollection([{"title": "tomato1", done: false}, {title: "tomato2", done: true}]);
    // 倒计时参数Model
    this.countDownConfig = new CountDownConfig({duration: 10, going: false});
    // 番茄输入框Model
    this.potatoInput = new InputField({"title": ""});

    // 绑定View
    this.viewPotato = new PotatoListView({el: this.potatoList, model: this.potatos});
    this.viewTomato = new TomatoListView({el: this.tomatoList, model: this.tomatos});
    this.viewCountDown = new TimeCountDown({el: this.countDown, model: this.countDownConfig});
    this.viewPotatoInputField = new InputFieldView({el: this.inputPotato, model: this.potatoInput});

    this.viewPotato.render();
    this.viewTomato.render();
    this.viewCountDown.render();
    this.viewPotatoInputField.render();

    // this.listenTo(countDownConfig, 'change', this.toggleStatus);

    this.listenTo(this.potatos, 'add', this.addOnePotato);
    this.listenTo(this.potatos, 'reset', this.addAllPotato);
    this.listenTo(this.potatos, 'all', this.render);

    this.listenTo(this.tomatos, 'add', this.addOneTomato);
    this.listenTo(this.tomatos, 'reset', this.addAllTomato);
    this.listenTo(this.tomatos, 'all', this.render);
  },

  events: {
    "click #btn-addPotato" : "addPotato",
    "click #btn-addTomato": "addTomato"
  },

  toggleStatus: function() {
    this.btnStart.toggleClass("disabled", this.model.get('done'));
    $("#input-todo").attr("disabled", countDownConfig.get("starting"));
  },

  addPotato: function() {
    var title = $("#input-potato").val();
    var newpotato = new PotatoModel({'title': title});
    if (newpotato.isValid()) {
      this.potatos.add(newpotato);
    }
    // countDownConfig.set("starting", true);

  },

  addTomato: function() {
    var title = $("#input-tomato").val();
    var newTomato = new TomatoModel({'title': title});
    if (newTomato.isValid()) {
      this.tomatos.add(newTomato);
    }
  },

  render: function() {
    // console.log("render");
  }
});
