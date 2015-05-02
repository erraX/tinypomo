PotatoCollection = Backbone.Collection.extend
  model: PotatoModel
  localStorage: new Backbone.LocalStorage "tinypomo"

TomatoCollection = Backbone.Collection.extend
  model: TomatoModel
  localStorage: new Backbone.LocalStorage "tinypomo"
  done: ->
    this.where {done: true}
  remaining: ->
    this.where {done: false}
