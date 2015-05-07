eventTransfer = _.extend {}, Backbone.Events

InputFieldView = Backbone.View.extend
  initialize: ->
    eventTransfer.on 'tomatoClicked', this.onTomatoClicked, this
    eventTransfer.on 'onGoingchanged', this.onGoing, this
    return
  onTomatoClicked: (data) ->
    this.$el.find("input").val data.title
    return
  onGoing: (data) ->
    this.$el.find(".button").toggleClass "disabled", data.going
    this.$el.find("input").attr "disabled", data.going
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
    this.listenTo this.model, "change", this.render
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

    if this.model.get "done"
        this.$el
            .find ".ckbox-label"
            .attr "class", "ckbox-label checked"
    else
        this.$el
            .find ".ckbox-label"
            .attr "class", "ckbox-label"
    return

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
    eventTransfer.on 'receiveTime', this.change, this
    eventTransfer.on 'onGoingchanged', this.onGoing, this
    return

  pad: (num, n) ->
    len = num.toString().length
    while len < n
        num = "0" + num
        len++
    num

  change: (data) ->
    duration = data.time
    min = Math.floor duration / 60
    sec = duration % 60

    console.log "duration:" + duration
    console.log "min:" + min
    console.log "sec:" + sec

    min = this.pad min, 2
    sec = this.pad sec, 2
    this.$el.html min + ":" + sec

  onGoing: (data) ->
    if not data.going
        this.$el.html "02:00"

AppView = Backbone.View.extend
  el: $("#container")
  initialize: ->
    # 添加网页中已有的元素
    # ----------------------------------------------------
    # 土豆和番茄的列表
    this.potatoList = this.$("#seg-potato")
    this.tomatoList = this.$("#seg-tomato")

    # 土豆和番茄的输入框和按钮
    this.inputPotato = this.$("#input-potato")
    this.inputTomato = this.$("#input-tomato")

    # 添加土豆和番茄的按钮
    this.btnStart = this.$("#input-potato .button")
    this.btnAddPlan = this.$("#input-tomato .button")

    # 倒计时表
    this.countDown = this.$("#countdown")

    # 初始化Model
    # ----------------------------------------------------
    # 土豆和番茄的列表Model
    this.potatos = new PotatoCollection [{"title": "potato1"}]
    this.tomatos = new TomatoCollection [{"title": "tomato1", done: false}, {title: "tomato2", done: true}]
    # 倒计时参数Model
    this.countDownConfig = new CountDownConfig {duration: 120, going: false, time: 120}
    # 番茄输入框Model
    this.potatoInput = new InputField {"title": ""}

    # 绑定View
    this.viewPotato = new PotatoListView {el: this.potatoList, model: this.potatos}
    this.viewTomato = new TomatoListView {el: this.tomatoList, model: this.tomatos}
    this.viewCountDown = new TimeCountDown {el: this.countDown, model: this.countDownConfig}
    this.viewPotatoInputField = new InputFieldView {el: this.inputPotato, model: this.potatoInput}

    this.viewPotato.render()
    this.viewTomato.render()
    this.viewCountDown.render()
    this.viewPotatoInputField.render()

    # this.listenTo this.potatos, 'add', this.addOnePotato
    this.listenTo this.potatos, 'reset', this.addAllPotato
    this.listenTo this.potatos, 'all', this.render

    #  this.listenTo this.tomatos, 'add', this.addOneTomato
    this.listenTo this.tomatos, 'reset', this.addAllTomato
    this.listenTo this.tomatos, 'all', this.render

    eventTransfer.on 'addOnePotato', this.addOnePotato, this

  events:
    "click #input-potato .button" : "addPotato",
    "click #input-tomato .button": "addTomato"

  addPotato: ->
    title = $("#input-potato input").val()
    newpotato = new PotatoModel {'title': title}
    if newpotato.isValid()
      # 等倒计时完成了再添加番茄
      # 开始倒计时
      this.countDownConfig.set 'going', true
      this.countDownConfig.set 'time', this.countDownConfig.get 'duration'
      console.log "Starting potato Going: " + this.countDownConfig.get "going"
      console.log " Duration" + this.countDownConfig.get 'time'
      eventTransfer.trigger 'onGoingchanged', {'going': true}
      this.startCountDown this.countDownConfig
    return

  addOnePotato: ->
    title = $("#input-potato input").val()
    newpotato = new PotatoModel {'title': title}
    this.potatos.add newpotato
    return

  startCountDown: (cdConfig)->
    decrement = ->
      if cdConfig.get "time"
        cdConfig.dec()
        setTimeout decrement, 1000
        eventTransfer.trigger 'receiveTime', {'time': cdConfig.get "time"}
        eventTransfer.trigger 'onGoingchanged', {'going': true}
      else
        cdConfig.set "going", false
        eventTransfer.trigger 'onGoingchanged', {'going': false}
        eventTransfer.trigger 'addOnePotato'
        eventTransfer.trigger 'resetCountDown'
      return
    decrement()

  addTomato: ->
    title = $("#input-tomato input").val()
    newTomato = new TomatoModel {'title': title}
    if newTomato.isValid()
      this.tomatos.add newTomato
