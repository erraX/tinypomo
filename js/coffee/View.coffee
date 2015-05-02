eventTransfer = _.extend {}, Backbone.Events

InputFieldView = Backbone.View.extend
  initialize: ->
    eventTransfer.on 'tomatoClicked', this.onTomatoClicked, this
    return
  onTomatoClicked: (data)->
    this.$el.val data.title
    return
  render: ->
    this.$el.val this.model.get "title"
    return

PotatoView = Backbone.View.extend
  tagname: "div"
  className: "item"
  initialize: ->
    this.template = _.template $("#potatoItem").html()
    return
  render: ->
    this.$el.html this.template this.model.attributes
    this

PotatoListView = Backbone.View.extend
  initialize: ->
    this.listenTo this.model, "add", this.render
    this.listenTo this.model, "change", this.render
    this.listenTo this.model, "remove", this.render
  render: ->
    this.$el.html ""
    for m, i in this.model
      view = new PotatoView {model: this.model.at i}
      this.$el.append view.$el
      view.render()
    this

TomatoView = Backbone.View.extend
  tagname: "div"
  className: "item"
  initialize: ->
    this.template = _.template $("#tomatoItem").html()
    return
  events:
    "click .ckbox-label": "addToPotatoInputField"
    "click .ui.checkbox": "toggleDone"
  addToPotatoInputField: ->
    title = this.$el
      .find ".ckbox-label"
      .html()
    eventTransfer.trigger 'tomatoClicked', {'title': title}
    return
  toggleDone: ->
    this.model.toggle()
    return
  render: ->
    this.$el.html this.template this.model.attributes
    this.$el
      .find ".ui.checkbox"
      .checkbox if this.model.get "done" then 'check' else 'uncheck'
    this

TomatoListView = Backbone.View.extend
  initialize: ->
    this.listenTo this.model, "add", this.render
    # 这边不注释的话会导致勾选完成重新渲染页面，还会回到没有勾选的状态
    this.listenTo this.model, "remove", this.render
    return
  render: ->
    this.$el.html ""
    self = this
    for m, i in this.model
      view = new TomatoView {model: this.model.at i}
      this.$el.append view.$el
      view.render()
    return this

TimeCountDown = Backbone.View.extend
  initialize: ->
    this.listenTo this.model, 'change', this.render
    return
  render: ->
    return

AppView = Backbone.View.extend
  el: $("#container")
  initialize: ->
    # 添加网页中已有的元素
    # ----------------------------------------------------
    # 土豆和番茄的列表
    this.potatoList = this.$("#seg-potato")
    this.tomatoList = this.$("#seg-tomato")

    # 土豆和番茄的输入框
    this.inputPotato = this.$("#input-potato")
    this.inputTomato = this.$("#input-tomato")

    # 添加土豆和番茄的按钮
    this.btnStart = this.$("#btn-addPotato")
    this.btnAddPlan = this.$("#btn-addTomato")

    # 倒计时表
    this.countDown = this.$("#countdown")

    # 初始化Model
    # ----------------------------------------------------
    # 土豆和番茄的列表Model
    this.potatos = new PotatoCollection [{"title": "potato1"}]
    this.tomatos = new TomatoCollection [{"title": "tomato1", done: false}, {title: "tomato2", done: true}]
    # 倒计时参数Model
    this.countDownConfig = new CountDownConfig {duration: 10, going: false}
    # 番茄输入框Model
    this.potatoInput = new InputField {"title": ""}

    # 绑定View
    this.viewPotato = new PotatoListView {el: this.potatoList, model: this.potatos}
    this.viewTomato = new TomatoListView {el: this.tomatoList, model: this.tomatos}
    this.viewCountDown = new TimeCountDown {el: this.countDown, model: this.countDownConfig}
    this.viewPotatoInputField = new InputFieldView {el: this.inputPotato, model: this.potatoInput}

    this.viewPotato.render();
    this.viewTomato.render();
    this.viewCountDown.render();
    this.viewPotatoInputField.render();

    this.listenTo this.potatos, 'add', this.addOnePotato
    this.listenTo this.potatos, 'reset', this.addAllPotato
    this.listenTo this.potatos, 'all', this.render

    this.listenTo this.tomatos, 'add', this.addOneTomato
    this.listenTo this.tomatos, 'reset', this.addAllTomato
    this.listenTo this.tomatos, 'all', this.render

  events:
    "click #btn-addPotato" : "addPotato",
    "click #btn-addTomato": "addTomato"

  toggleStatus: ->
    this.btnStart.toggleClass "disabled", this.model.get('done')
    $("#input-todo").attr "disabled", countDownConfig.get("starting")
    return

  addPotato: ->
    title = $("#input-potato").val()
    newpotato = new PotatoModel {'title': title}
    if newpotato.isValid()
      this.potatos.add newpotato

  addTomato: ->
    title = $("#input-tomato").val()
    newTomato = new TomatoModel {'title': title}
    if newTomato.isValid()
      this.tomatos.add newTomato
