PotatoModel = Backbone.Model.extend 
  default:
    title: ""
  validate: (attr)->
    if not attr.title
      alert "请输入接下来准备做的事"
      "error"

TomatoModel = Backbone.Model.extend
  default:
    title: ""
    done: false
  validate: (attr)->
    if not attr.title
      alert("请输入你想要做的任务")
      "error"
  toggle: ->
    this.save done: not this.get "done"
    return

CountDownConfig = Backbone.Model.extend
  default:
    duration: 10
    time: 10
    going: false
  initialize: ->
    this.on 'change:time', ->
      console.log "Countdownconfig changed"
      if this.attributes.time
        this.attributes.going = false
      return
    return

  dec: ->
    this.attributes.time--
    console.log "CountDownConfig decrement, now: " + this.attributes.time

InputField = Backbone.Model.extend()
